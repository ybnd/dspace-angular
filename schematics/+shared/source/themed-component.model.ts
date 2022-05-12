import { DerivedComponent } from './derived-component.model';
import { Component } from './component.model';
import { dirname } from 'path';
import {
  EntryComponentDecoratorArgumentType, THEMEABLE_ENTRY_COMPONENT_DECORATORS, THEMES,
} from '../dspace';
import { fromSrc } from '../paths';
import { Module } from './module.model';
import { TypescriptFile } from './typescript-file.model';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { SchematicContext, SchematicsException } from '@angular-devkit/schematics';
import { Change } from '@schematics/angular/utility/change';
import * as assert from 'assert';
import { appendIdentifierToArrayLiteral, asArrayLiteralString } from '../util';
import { ImportList } from './import-list.model';

export interface ThemedComponentSections {
  imports: string;
  decorators?: string;
  animations?: string;
}

export class ThemedComponent extends DerivedComponent {
  public readonly theme: string;

  constructor(base: Component, theme: string) {
    super(base);
    this.theme = theme;
  }

  public get className(): string {
    return this.base.className;
  }

  public get dir(): string {
    return dirname(this.path);
  }

  public get fileName(): string {
    return this.base.fileName;
  }

  public get path(): string {
    return THEMES + this.theme + fromSrc(this.base.path);
  }

  public get selector(): string {
    return this.base.selector;
  }

  public declare(): void {
    if (this.base.isEntryComponent) {
      const file = new TypescriptFile(this.base.tree, THEMES + this.theme + '/entry-components.ts');
      const statements = file.source.statements.filter(node => node.kind !== ts.SyntaxKind.ImportDeclaration);

      let changes: Change[] = [];
      if (statements.length === 0) {

      } else {
        try {
          assert(statements.length === 1, `there were ${statements.length} statements`);
          assert(statements[0].kind === ts.SyntaxKind.VariableStatement, 'the file did not include a variable');

          let arrayLiteral = (statements[0] as ts.VariableStatement).declarationList.declarations[0].initializer;
          assert(arrayLiteral?.kind === ts.SyntaxKind.ArrayLiteralExpression, 'it did not declare an array');

          assert(
            statements[0].modifiers?.length && statements[0].modifiers[0].kind === ts.SyntaxKind.ExportKeyword,
            'the array was not exported'
          );

          changes.push(
            insertImport(file.source, file.path, this.className, file.importPath(this)),
            appendIdentifierToArrayLiteral(file.source, arrayLiteral as ts.ArrayLiteralExpression, this.className),
          );
        } catch(e) {
          throw new SchematicsException(
            `Expected ${file.path} to consist of a single exported array literal; but ${e.message}`
          );
        }
      }
      file.apply(changes);
    }
    new Module(this.base.tree, THEMES + this.theme + '/theme.module.ts').addDeclaration(this);
  }

  public get templateUrl(): string {
    return this.derivedPath(this.base.templateUrl);
  }

  public get styleUrls(): string[] {
    return this.base.styleUrls.map(path => this.derivedPath(path));
  }

  public getSections(context: SchematicContext): ThemedComponentSections {
    const imports = new ImportList(this.base.tree);
    const decorators: string[] = [];

    imports.add({
      text: 'Component',
      path: '@angular/core',
    });
    imports.add(this.base, { alias: 'BaseComponent' });

    const entryDecorators = THEMEABLE_ENTRY_COMPONENT_DECORATORS.filter(entry => this.base.doesImport(entry));
    for (const entryDecorator of entryDecorators) {

      const decoratorNodes = this.base.getDecoratorNodes(entryDecorator.text);

      if (decoratorNodes.length > 0) {
        imports.add(entryDecorator);
      }

      for (const decoratorNode of decoratorNodes) {
        const argNodes = (decoratorNode.expression as any).arguments;  // hasn't failed yet, but may fail in some cases
        const args: string[] = [];

        const handleCopy = (i: number) => {
          const value = argNodes[i]?.getText(this.base.source);
          if (argNodes.length <= i) {
            throw new SchematicsException(
              `Original component provides no value for argument ${i} of '@${entryDecorator.text}'`
            );
          }
          switch (argNodes[i].kind) {
            case (ts.SyntaxKind.StringLiteral): {
              break;
            }
            case (ts.SyntaxKind.Identifier): {
              imports.add(this.base.getIdentifierImport(value));
              break;
            }
            case (ts.SyntaxKind.PropertyAccessExpression): {
              imports.add(this.base.getIdentifierImport(argNodes[i].expression.escapedText));
              break;
            }
            default: {
              context.logger.warn(
                `Unexpected syntax for argument ${i} of '@${entryDecorator.text}', copied without import`
              );
            }
          }
          args.push(value);
        }

        entryDecorator.arguments.forEach((arg, i) => {
          switch (arg.type) {
            case (EntryComponentDecoratorArgumentType.COPY): {
              handleCopy(i);
              break;
            }
            case (EntryComponentDecoratorArgumentType.COPY_OR_DEFAULT): {
              if (argNodes.length > i) {
                handleCopy(i);
              } else {
                if (arg.defaultValue === undefined) {
                  context.logger.warn(
                    `No default specified for argument ${i} of '@${entryDecorator.text}', using 'undefined' instead`
                  )
                  args.push('undefined');
                } else {
                  args.push(arg.defaultValue);
                  if (arg.symbol !== undefined) {
                    imports.add(arg.symbol);
                  }
                }
              }
              break;
            }
            case (EntryComponentDecoratorArgumentType.THEME): {
              args.push('\'' + this.theme + '\'');
              break;
            }
          }
        });

        decorators.push(`@${entryDecorator.text}(${args.join(', ')})`)
      }
    }

    const animations: string[] = [];
    this.base.animations.forEach(animation => {
      imports.add(this.base.getIdentifierImport(animation));
      animations.push(animation);
    });

    return {
      imports: imports.getSection(this),
      decorators: decorators.join('\n'),
      animations: '\n  animations: ' + asArrayLiteralString(animations, { overIndentBy: 1, doQuote: false}),
    };
  }
}
