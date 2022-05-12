import { DirEntry, Tree } from '@angular-devkit/schematics';
import { TypescriptFile } from './typescript-file.model';
import { THEMED_COMPONENT, THEMES } from '../dspace';
import { IReplace, ISymbol } from '../interfaces';
import * as assert from 'assert';
import { Module } from './module.model';
import { Component } from './component.model';

export const RE_TS = /.ts$/;
export const RE_TS_NON_SPEC = /(?<!spec)\.ts$/;
export const RE_HTML = /.html$/;

export class Project {
  public readonly tree: Tree;

  constructor(tree: Tree) {
    this.tree = tree;
  }

  public assertDSpaceAngular({ withThemeSupport }: {
    withThemeSupport?: boolean
  }): void {
    const ROOT = require('pkg-dir').sync()
    assert(ROOT !== undefined, `${ROOT} is not a Node project!`);

    const info = require(ROOT + '/package.json');
    assert(info.name === 'dspace-angular', `${ROOT} is not a DSpace Angular project!`); // todo: this may be a bit much

    if (withThemeSupport) {
      assert([
        this.tree.exists(THEMED_COMPONENT + '.ts'),
        this.tree.exists(THEMED_COMPONENT + '.html'),
      ].every(Boolean), `${ROOT} has no theme support!`)
    }
  }

  public hasTheme(theme: string): boolean {
    return this.tree.getDir(THEMES + theme) !== null;
  }

  private subPaths(path: string, filePattern: RegExp, excludePaths: string[]): [string[], string[]] {
    const dir = this.tree.getDir(path);
    return [
      dir.subdirs
         .map(pf => dir.path + '/' + pf)
         .filter(path => !excludePaths.includes(path)),
      dir.subfiles
         .filter(pf => filePattern.test(pf))
         .map(pf => dir.path + '/' + pf)
         .filter(path => !excludePaths.includes(path)),
    ]
  }

  replace(path: string, filePattern: RegExp, excludePaths: string[], replacements: IReplace[]): void {
    this.applyToTypescriptFiles(file => file.replace(replacements), path, false, excludePaths);
  }

  replaceTypescriptUsages(
    path: string, excludeSpecs: boolean, excludePaths: string[],
    oldSymbol: ISymbol, newSymbol: ISymbol, skipIfExtending = true
  ): void {
    this.applyToTypescriptFiles(
      file => file.replaceUsages(oldSymbol, newSymbol, skipIfExtending),
      path, excludeSpecs, excludePaths
    );
  }

  applyToTypescriptFiles(
    fun: (file: TypescriptFile) => void,
    path?: string, excludeSpecs?: boolean, excludePaths?: string[]
  ): void {
    if (path === undefined) {
      path = this.tree.root.path;
    }
    if (excludePaths === undefined) {
      excludePaths = []
    }

    const [dirs, paths] = this.subPaths(path, excludeSpecs ? RE_TS_NON_SPEC: RE_TS, excludePaths);

    for (const dir of dirs) {
      this.applyToTypescriptFiles(fun, dir, excludeSpecs, excludePaths);
    }
    for (const path of paths) {
      const file = new TypescriptFile(this.tree, path);
      if (file !== null) {
        fun(file);
      }
    }
  }

  public findDeclaringModule(file: Component): Module | null {  // todo: should probably be at Project level
    let dir: DirEntry | null = file.dirEntry;

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
                           candidate !== null && !candidate.isRoutingModule && candidate.doesImport(file)
                         );
      if (modules.length > 0) {
        return modules[0];
      }

      dir = dir.parent;
    }

    return null;
  }
}
