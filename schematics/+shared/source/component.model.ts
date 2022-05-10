import { DirEntry } from '@angular-devkit/schematics';
import { findNodes, getDecoratorMetadata } from '@schematics/angular/utility/ast-utils';
import { Module } from './module.model';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { TypescriptFile } from './typescript-file.model';
import * as ts from 'typescript';
import { IFile, ISymbol } from '../interfaces';

export class Component extends TypescriptFile implements ISymbol {
  public className: string;
  public selector: string;

  private _decorators: ts.Decorator[] | undefined;
  private _metadata: ts.Node | undefined;

  public refresh(): void {
    super.refresh();
    this._decorators = undefined;
    this._metadata = undefined;
    this.selector = (this.metadata as any).properties.filter(
      (property: any) => property.name.escapedText === 'selector',
    )[0].initializer.text;
    this.className = (this.metadata as any).parent.parent.parent.name.escapedText;
  }

  public get fileName(): string {  // todo: fragile, should take actual filename instead
    return dasherize(this.className).replace(/-component$/, '.component');
  }

  public get text(): string {
    return this.className;
  }

  public get file(): IFile {
    return this;
  }

  public get templateUrl(): string {
    return (this.metadata as any).properties.filter(
      (property: any) => property.name.escapedText === 'templateUrl'
    )[0].initializer.text;
  }

  public get styleUrls(): string[] {
    const styleUrlsNode = (this.metadata as any).properties.filter(
      (property: any) => property.name.escapedText === 'styleUrls'
    );

    if (styleUrlsNode.length != 0) {
      return styleUrlsNode[0].initializer.elements.map((element: any) => element.text);
    } else {
      const styleUrl = (this.metadata as any).properties.filter(
        (property: any) => property.name.escapedText === 'styleUrl'
      )[0].initializer.text;

      if (styleUrl) {
        return [styleUrl]
      } else {
        return []
      }
    }
  }

  public get animations(): string[] {
    const animationsNode = (this.metadata as any).properties.filter(
      (property: any) => property.name.escapedText === 'animations'
    );

    if (animationsNode.length != 0) {
      // todo: we're assuming animations are _always_ an array literal, this may be fragile (e.g. what if it's an imported constant? what if it's a local constant?)
      return animationsNode[0].initializer.elements.map((element: any) => element.text)
    } else {
      return [];
    }

  }

  public findDeclaringModule(): Module | null {  // todo: should probably be at Project level
    let dir: DirEntry | null = this.dirEntry;

    while (dir !== null) {

      const modules = dir.subfiles
                         .map(pf => {
                           try {
                             return new Module(this.tree, dir?.path + '/' + pf);
                           } catch(e) {
                             return null;
                           }
                         })
                         .filter(candidate =>
                           candidate !== null && !candidate.isRoutingModule && candidate.doesImport(this)
                         )
      if (modules.length > 0) {
        return modules[0];
      }

      dir = dir.parent;
    }

    return null;
  }

  public findInputsAndOutputs(): ts.Decorator[] {
    return [
      ...this.getDecoratorNodes('Input'),
      ...this.getDecoratorNodes('Output'),
    ];
  }

  protected get decorators(): ts.Decorator[] {
    if (this._decorators === undefined) {
      this._decorators = findNodes(this.source, ts.SyntaxKind.Decorator).map(node => node as ts.Decorator);
    }
    return this._decorators;
  }

  protected get metadata(): ts.Node {
    if (this._metadata === undefined) {
      this._metadata = getDecoratorMetadata(this.source, 'Component', '@angular/core')[0] as ts.ObjectLiteralExpression;
    }
    return this._metadata;
  }

  public getDecoratorNodes(decorator: string): ts.Decorator[] {
    return this.decorators
               .filter((node: any) => node.expression.expression.escapedText === decorator);
  }
}
