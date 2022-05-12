import { SourceFile } from './file.model';
import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { InsertChange, NoopChange, RemoveChange, ReplaceChange } from '@schematics/angular/utility/change';

let tree: Tree;
let file: SourceFile;

const PATH = '/src/app/test.file';
const CONTENT = `
this file has some content.
`;
const NEW_CONTENT = `
this file has some new content now.
`;

describe('SourceFile', () => {
  beforeEach(() => {
    tree = Tree.empty();
    tree.create(PATH, CONTENT);
    file = new SourceFile(tree, PATH);
  });

  it('should know the directory containing this file', () => {
    expect(file.dir).toBe('/src/app');
  });

  it('should load content', () => {
    expect(file.content).toBe(CONTENT);
  });

  it('should load content as ts.SourceFile for AST processing', () => {
    expect(file.source.kind).toBe(ts.SyntaxKind.SourceFile);
    expect(file.source.text).toBe(CONTENT);
  });

  it('should cache content and reload on refresh', () => {
    expect(file.content).toBe(CONTENT);
    expect(file.source.text).toBe(CONTENT);

    tree.overwrite(PATH, NEW_CONTENT);

    expect(file.content).toBe(CONTENT);
    expect(file.source.text).toBe(CONTENT);

    file.refresh();
    expect(file.content).toBe(NEW_CONTENT);
    expect(file.source.text).toBe(NEW_CONTENT);
  });

  it('should overwrite content', () => {
    // @ts-ignore
    file.overwrite(NEW_CONTENT);

    expect(file.content).toBe(NEW_CONTENT);
    expect(file.source.text).toBe(NEW_CONTENT);
  });

  it('should replace content', () => {
    file.replace([
      { searchValue: 'content', replaceValue: 'new content' },
      { searchValue: '.', replaceValue: ' now.'}
    ])
    expect(file.content).toBe(NEW_CONTENT);
    expect(file.source.text).toBe(NEW_CONTENT);
  });

  describe('apply changes', () => {
    // todo: this doesn't work
    it('should not change on NoopChange', () => {
      expect(file.content).toBe(CONTENT);
      expect(file.source.text).toBe(CONTENT);

      file.apply([
        new NoopChange(),
      ]);

      expect(file.content).toBe(CONTENT);
      expect(file.source.text).toBe(CONTENT);
    });

    it('should insert on InsertChange', () => {
      expect(file.content).toBe(CONTENT);
      expect(file.source.text).toBe(CONTENT);

      file.apply([
        new InsertChange(PATH, 1, 'after insert '),
      ]);

      expect(file.content).toBe('\nafter insert this file has some content.\n');
    });

    it('should remove on RemoveChange', () => {
      expect(file.content).toBe(CONTENT);
      expect(file.source.text).toBe(CONTENT);

      file.apply([
        new RemoveChange(PATH, 1, 'this file '),
      ]);

      expect(file.content).toBe('\nhas some content.\n');
    });

    it('should replace on ReplaceChange', () => {
      expect(file.content).toBe(CONTENT);
      expect(file.source.text).toBe(CONTENT);

      file.apply([
        new ReplaceChange(PATH, 20, 'content', 'replaced stuff'),
      ]);

      expect(file.content).toBe('\nthis file has some replaced stuff.\n');
    });
  });
});
