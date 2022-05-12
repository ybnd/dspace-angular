import { DirEntry, FileEntry, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { dirname } from 'path';
import { applyChanges} from '../util';
import { Change } from '@schematics/angular/utility/change';
import { IFile, IReplace } from '../interfaces';

export class SourceFile implements IFile {
  public readonly tree: Tree;
  public readonly path: string;

  protected _fileEntry: FileEntry;
  protected _dirEntry: DirEntry;

  private _source: ts.SourceFile | undefined;

  constructor(tree: Tree, path: string) {
    this.tree = tree;
    this.path = path;

    this.refresh();
  }

  public get dir(): string {
    return dirname(this.path);
  }

  public get name(): string {
    return this.path.replace(this.dir, '');  // todo: probably dumb
  }

  public refresh(): void {
    const fileEntry = this.tree.get(this.path);
    const dirEntry = this.tree.getDir(this.dir);

    if (fileEntry !== null && dirEntry !== null) {
      this._fileEntry = fileEntry;
      this._dirEntry = dirEntry;
      this._source = undefined;
    } else {
      throw new SchematicsException(`File ${this.path} doesn't exist!`);
    }
  }

  public get content(): string {
    return this._fileEntry.content.toString();
  }

  public get source(): ts.SourceFile {
    if (this._source === undefined) {
      this._source = ts.createSourceFile(this.path, this.content, ts.ScriptTarget.Latest, true);
    }
    return this._source;
  }

  public get fileEntry(): FileEntry {
    return this._fileEntry;
  }

  public get dirEntry(): DirEntry {
    return this._dirEntry;
  }

  public replace(replacements: IReplace[]): void {
    for (const replacement of replacements) {
      this.overwrite(this.content.replace(replacement.searchValue, replacement.replaceValue));
    }
  }

  public apply(changes: Change[]): void {
    applyChanges(this.tree, this._fileEntry, changes);
    this.refresh();
  }

  protected overwrite(newContent: string) {
    if (newContent !== this.content) {
      this.tree.overwrite(this.path, newContent);
      this.refresh();
    }
  }
}
