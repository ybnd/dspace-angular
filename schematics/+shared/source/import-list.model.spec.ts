import { Tree } from '@angular-devkit/schematics';
import { ImportList } from './import-list.model';
import { IFile } from '../interfaces';

let tree: Tree;

let file: IFile;
let imports: ImportList;

describe('ImportList', () => {
  beforeEach(() => {
    tree = Tree.empty();
    file = { path: '/src/app/test/import-list/file.ts' };
    imports = new ImportList(tree);
  });

  it('should start out empty', () => {
    expect(imports.getSection({ path: '/src/app/test/import-list/file.ts' })).toBe('');
  });

  it('should include imports relative to path', () => {
    imports.add({ text: 'Something', path: '/src/app/somewhere.ts' })
    imports.add({ text: 'SomethingElse', path: '/src/app/somewhere.ts' })
    imports.add({ text: 'SomethingElseEntirely', path: '/src/app/somewhere/else.ts' })
    imports.add({ text: 'Component, OnInit', path: '@angular/core' })
    imports.add({ text: 'SomethingElseEntirely', path: '/src/app/somewhere/else.ts' })

    expect('\n' + imports.getSection({ path: '/src/app/test/import-list/file.ts' })).toBe(`
import { Something, SomethingElse } from '../../somewhere';
import { SomethingElseEntirely } from '../../somewhere/else';
import { Component, OnInit } from '@angular/core';`)
    expect('\n' + imports.getSection({ path: '/src/app/file.ts' })).toBe(`
import { Something, SomethingElse } from './somewhere';
import { SomethingElseEntirely } from './somewhere/else';
import { Component, OnInit } from '@angular/core';`)
  });
});
