import { IFile, ISymbol } from '../interfaces';
import { Tree } from '@angular-devkit/schematics';
import { ensureAbsolute, ensureNoExtension } from '../paths';
import { TypescriptFile } from './typescript-file.model';
import { dirname, relative } from 'path';
import { getImportLine } from '../util';

export class ImportList {
  private readonly tree: Tree;
  private imports: Map<string, Set<string>>;

  constructor(tree: Tree) {
    this.tree = tree;
    this.imports = new Map();
  }

  public add(symbol: ISymbol | null, { fromFile, alias }: { fromFile?: TypescriptFile, alias?: string } = {}): void {
    if (symbol === null) {
      return;
    }
    const path = ensureNoExtension(ensureAbsolute(symbol.path, fromFile?.dir));
    if (!this.imports.has(path)) {
      this.imports.set(path, new Set<string>());
    }
    if (alias === undefined) {
      this.imports.get(path)?.add(symbol.text);
    } else {
      this.imports.get(path)?.add(symbol.text + ' as ' + alias);
    }
  }

  public getSection(from: IFile): string {
    const lines: string[] = [];

    this.imports.forEach((symbols, path) => {
      lines.push(getImportLine([...symbols], ImportList.resolvePath(path, from)));
    });

    return lines.join('\n');
  }

  public get identifiers(): string[] {
    const identifierList: string[] = [];

    this.imports.forEach((imp) => {
      imp.forEach((identifier) => {
        identifierList.push(ImportList.resolveIdentifier(identifier))
      })
    });

    return identifierList;
  }

  private static resolvePath(path: string, from: IFile): string {
    if (!path.startsWith('/')) {
      return path;
    } else {
      const resolved = relative(dirname(from.path), path);
      if (resolved.startsWith('.')) {
        return resolved
      } else {
        return './' + resolved;
      }
    }
  }

  private static resolveIdentifier(imp: string): string {
    const parts = imp.split(' as ');
    if (parts.length === 1) {
      return imp;
    } else {
      // aliased import, return the alias
      return parts[1];
    }
  }
}
