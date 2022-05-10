import { SourceFile } from './file.model';
import * as ts from 'typescript';
import { findNode, findNodes } from '@schematics/angular/utility/ast-utils';
import { Change, ReplaceChange } from '@schematics/angular/utility/change';
import { IAlias, IFile, ISymbol } from '../interfaces';
import { Import } from './import.model';
import { importPath } from '../paths';
import { findAncestorNode, importIdentifier, stripQuotes } from '../util';

export class TypescriptFile extends SourceFile {  // todo: maybe add a check that it's actually a TypeScript file
  private _importDeclarations: ts.ImportDeclaration[] | undefined;

  public refresh(): void {
    super.refresh();
    this._importDeclarations = undefined;
  }

  public importPath(file: IFile | string): string {
    let path: string;
    if (typeof file === 'string') {
      path = file;
    } else {
      path = file.path;
    }

    return importPath(path, this.path);
  }

  public get importDeclarations(): ts.ImportDeclaration[] {
    if (this._importDeclarations === undefined) {
      this._importDeclarations = findNodes(this.source, ts.SyntaxKind.ImportDeclaration) as ts.ImportDeclaration[];
    }
    return this._importDeclarations;
  }

  public getIdentifierImport(identifier: string): Import | null {
    const usages = findNodes(this.source, ts.SyntaxKind.Identifier).filter(
      (node: ts.Identifier) => node.escapedText === identifier
    );
    const imports = usages.filter(usage => usage.parent.kind === ts.SyntaxKind.ImportSpecifier)
                          .map(usage => findAncestorNode<ts.ImportDeclaration>(usage, ts.SyntaxKind.ImportDeclaration))
                          .filter(importDeclaration => importDeclaration !== null)
                          .map((importDeclaration: ts.ImportDeclaration) => new Import(
                              {
                                text: identifier,
                                path: stripQuotes(importDeclaration.moduleSpecifier.getText(this.source)),
                              },
                              this
                          ))
    if (imports.length > 0) {
      return imports[0];
    } else {
      return null;
    }
  }

  public doesImport(symbol: ISymbol): boolean {
    const importFrom = this.importPath(symbol);

    // Quick check: is the old path even referenced at all?
    // If not, return immediately; don't bother parsing imports
    if (!this.content.includes(importFrom)) {
      return false;
    }

    for (const imp of this.importDeclarations) {
      if ((imp.moduleSpecifier as ts.StringLiteral).text === importFrom) {
        const importedSymbols = findNodes(imp, ts.SyntaxKind.ImportSpecifier).map(
          (node: ts.ImportOrExportSpecifier) => node.name.escapedText.toString()
        );
        if (importedSymbols.includes(symbol.text)) {
          return true;
        }
      }
    }
    return false;
  }

  public aliasImports(aliases: IAlias[]): void {
    const changes: Change[] = [];

    aliases.forEach(symbol => {
      const importFrom = this.importPath(symbol);

      if (this.doesImport(symbol)) {
        const imp = (
          this.importDeclarations.find(
            imp => (imp.moduleSpecifier as ts.StringLiteral).text === importFrom
          )?.importClause?.namedBindings as any
        )?.elements?.find((i: any) => i.getText() === symbol.text);

        if (imp !== undefined) {
          changes.push(new ReplaceChange(this.path, imp.pos + 1, symbol.text, importIdentifier(symbol)));

          findNodes(this.source, ts.SyntaxKind.Identifier)
            .filter((node: ts.Identifier) => node.parent.kind !== ts.SyntaxKind.ImportSpecifier)
            .filter((node: ts.Identifier) => node.escapedText.toString() === symbol.text)
            .forEach((node: ts.Identifier) => {
              changes.push(new ReplaceChange(this.path, node.pos + 1, node.getText(this.source), symbol.alias));
            });
        }
      }
    });

    if (changes.length > 0) {
      this.apply(changes);
    }
  }

  public replaceUsages(oldSymbol: ISymbol, newSymbol: ISymbol, skipIfExtending = true) {
    const importFrom = this.importPath(oldSymbol);

    // Quick check: is the old path even referenced at all?
    // If not, return immediately; don't bother parsing imports
    if (!this.content.includes(importFrom)) {
      return;
    }

    const changes: Change[] = [];

    for (const imp of this.importDeclarations) {
      if ((imp.moduleSpecifier as ts.StringLiteral).text === importFrom) {
        if (skipIfExtending) {
          for (const declaration of findNodes(this.source, ts.SyntaxKind.ClassDeclaration) as ts.ClassDeclaration[]) {
            if (declaration.heritageClauses?.some((node) =>
              node.getChildAt(0).kind === ts.SyntaxKind.ExtendsKeyword
                && findNode(node, ts.SyntaxKind.Identifier, oldSymbol.text) !== null
            )) {
              return;
            }
          }
        }

        changes.push(
          new ReplaceChange(
            this.path,
            imp.moduleSpecifier.pos + 1,
            imp.moduleSpecifier.getText(this.source),
            '\'' + this.importPath(newSymbol) + '\'',
          )
        )
        findNodes(this.source, ts.SyntaxKind.Identifier)
          .filter((node: ts.Identifier) => node.escapedText.toString() === oldSymbol.text)
          .forEach((node: ts.Identifier) => {
            changes.push(
              new ReplaceChange(
                this.path,
                node.pos + 1,
                node.getText(this.source),
                newSymbol.text
              )
            );
          });
      }
    }
    if (changes.length > 0) {
      this.apply(changes);
    }
  }
}
