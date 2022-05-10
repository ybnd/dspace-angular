import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { findNodes, getDecoratorMetadata, insertImport } from '@schematics/angular/utility/ast-utils';
import { TypescriptFile } from './typescript-file.model';
import * as ts from 'typescript';
import { appendIdentifierToArrayLiteral, insertAfterArrayLiteralEntry, print, stripQuotes } from '../util';
import { Component } from './component.model';
import { DerivedComponent } from './derived-component.model';
import { ISymbol } from '../interfaces';
import { Change, InsertChange, ReplaceChange } from '@schematics/angular/utility/change';
import { DECLARATIONS } from '../dspace';
import * as assert from 'assert';
import { ImportList } from './import-list.model';

export class Module extends TypescriptFile {
  private ngModule: ts.ObjectLiteralExpression;

  public refresh(): void {
    super.refresh();
    const decoratorCandidates = getDecoratorMetadata(this.source, 'NgModule', '@angular/core');
    if (decoratorCandidates.length !== 0) {
      this.ngModule = decoratorCandidates[0] as ts.ObjectLiteralExpression;
    } else {
      throw new SchematicsException(`File ${this.path} has no @NgModule decorator!`);
    }
  }

  public get isRoutingModule(): boolean {
    const hasRoutingInName = /routing.module.ts$/.test(this.path);
    const hasRoutes = /RouterModule.for(Child|Root)\(/.test(this.content);

    return hasRoutingInName && hasRoutes;
  }

  public insertDerivedComponentDeclaration(base: Component, derived: DerivedComponent): void {
    this.apply([
      insertImport(this.source, this.path, derived.className, this.importPath(derived)),
      ...findNodes(this.source, ts.SyntaxKind.Identifier)
        .filter((node) =>
          node.parent.kind !== ts.SyntaxKind.ImportSpecifier && (node as ts.Identifier).escapedText === base.text)
        .map((usage) => insertAfterArrayLiteralEntry(this.path, usage, derived.className)),
    ]);
  }

  public addDeclaration(symbol: ISymbol): void {
    const declarationsNodes = this.ngModule
                                  .properties
                                  .filter(node => node.name?.getText(this.source) === 'declarations');

    let changes: Change[] = [];
    if (declarationsNodes.length === 0) {
      const aboveModuleDecorator = this.ngModule.parent.getStart() - 1;
      const declarationsArray = ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              DECLARATIONS, undefined, undefined,
              ts.factory.createArrayLiteralExpression(
                // [ts.factory.createIdentifier(symbol.text + ',')],
                ts.factory.createNodeArray(
                  [ts.factory.createIdentifier(symbol.text)], true
                ),
                true,
              )
            )
          ],
          ts.NodeFlags.Const,
        )
      );

      const newNgModule = ts.factory.createObjectLiteralExpression(
        ts.factory.createNodeArray(
          [
            ts.factory.createPropertyAssignment(
              'declarations',
              ts.factory.createIdentifier(DECLARATIONS)
            ),
            ...this.ngModule.properties,
          ],
          true
        ),
        true,
      );

      changes.push(
        insertImport(this.source, this.path, symbol.text, this.importPath(symbol)),
        new InsertChange(
          this.path, aboveModuleDecorator,
          print(declarationsArray, this.source) + '\n\n'
        ),
        new ReplaceChange(
          this.path, this.ngModule.getStart(), this.ngModule.getText(this.source),
          print(newNgModule, this.source),
        ),
      );
    } else {
      // we're keeping the _last_ in case there's more than one for some reason.
      const declarations = (declarationsNodes[declarationsNodes.length - 1] as ts.PropertyAssignment).initializer;
      changes.push(insertImport(this.source, this.path, symbol.text, this.importPath(symbol)));

      switch (declarations.kind) {
        case ts.SyntaxKind.Identifier: {
          const statements = this.source.statements.filter(node => node.kind !== ts.SyntaxKind.ImportDeclaration);
          let arrayLiteral = (statements[0] as ts.VariableStatement).declarationList.declarations[0].initializer;
          assert(arrayLiteral?.kind === ts.SyntaxKind.ArrayLiteralExpression, 'it did not declare an array');
          changes.push(
            appendIdentifierToArrayLiteral(this.source, arrayLiteral as ts.ArrayLiteralExpression, symbol.text),
          );
          break;
        }
        case ts.SyntaxKind.ArrayLiteralExpression: {
          changes.push(
            appendIdentifierToArrayLiteral(
              this.source, declarations as ts.ArrayLiteralExpression, symbol.text, { overIndentBy: 1 }
            ),
          );
          break;
        }
        default: {
          console.warn(`Unexpected format for @NgModule declarations in ${this.path}: ${declarations.kind}. Make sure you declare ${symbol.text}!`);
        }
      }
    }
    this.apply(changes);
  }

  public get ngModuleImports(): ImportList {
    const importList = new ImportList(this.tree);

    const importIdentifiers = (
      this.ngModule.properties.filter((property: any) => property.name.escapedText === 'imports')[0] as any
    ).initializer.elements.map((identifier: any) => identifier.escapedText);

    for (const identifier of importIdentifiers) {
      importList.add(this.getIdentifierImport(identifier), { fromFile: this })
    }

    return importList;
  }
}
