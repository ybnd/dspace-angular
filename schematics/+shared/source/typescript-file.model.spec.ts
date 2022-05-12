import { TypescriptFile } from './typescript-file.model';
import { Tree } from '@angular-devkit/schematics';
import { getTypescriptFile } from './util.spec';

let tree: Tree;
let file: TypescriptFile;

const PATH = '/src/app/test.model.ts';

describe('TypescriptFile', () => {
  beforeEach(() => {
    tree = Tree.empty();
  });

  describe('getIdentifierImport', () => {
    beforeEach(() => {
      file = getTypescriptFile(tree, PATH, `
import { Something }  from '../somewhere.model';

const something = new Something()
const notAnIdentifier = "SomethingElse"
`);
    });

    it('should return import if identifier is imported', () => {
      const i = file.getIdentifierImport('Something');
      expect(i).toBeTruthy();
      expect(i?.text).toBe('Something');
      expect(i?.path).toBe('/src/somewhere.model');
    });

    it('should return null if identifier is not imported', () => {
      const i = file.getIdentifierImport('SomethingElse');
      expect(i).toBe(null);
    });
  });

  describe('doesImport', () => {
    beforeEach(() => {
      file = getTypescriptFile(tree, PATH, `
import { Something }  from '../somewhere.model';
import { Component } from '@angular/core'
`
      );
    });

    it('should return true for used project imports', () => {
      expect(file.doesImport({ text: 'Something', path: '/src/somewhere.model' })).toBe(true)
    });

    it('should return true for used dependency imports', () => {
      expect(file.doesImport({ text: 'Component', path: '@angular/core' })).toBe(true);
    });

    it('should return false for non-imported symbols', () => {
      expect(file.doesImport({ text: 'SomethingElse', path: '/src/somewhere.model.ts' })).toBe(false);
      expect(file.doesImport({ text: 'Injectable', path: '@angular/core' })).toBe(false);
    });

    it('should return false for non-imported paths', () => {
      expect(file.doesImport({ text: 'Something', path: '/src/somewhere/else.model.ts' })).toBe(false);
      expect(file.doesImport({ text: 'Something', path: '/src/app/somewhere.model.ts' })).toBe(false);
      expect(file.doesImport({ text: 'Component', path: '@angular' })).toBe(false);
    });
  });

  describe('replaceUsages', () => {
    describe('standard', () => {
      const og = `
import { Something }  from '../somewhere.model';

something = Something('with', 'arguments', 123);
`;
      const changed = `
import { SomethingElse }  from '../somewhere/else.model';

something = SomethingElse('with', 'arguments', 123);
`;

      beforeEach(() => {
        file = getTypescriptFile(tree, PATH, og);
      });

      it('should replace usages and imports', () => {
        file.replaceUsages(
          { text: 'Something', path: '/src/somewhere.model' },
          { text: 'SomethingElse', path: '/src/somewhere/else.model' }
        );
        file.refresh();
        expect(file.content).toBe(changed);
      });

      it('should not change the file if there is nothing to replace', () => {
        file.replaceUsages(
          { text: 'Nothing', path: '/src/nowhere.model' },
          { text: 'Something', path: '/src/somewhere.model' }
        );
        file.refresh();
        expect(file.content).toBe(og);
      });
    });

    describe('when class to be replaced is extended', () => {
      const og = `
import { Something }  from '../somewhere.model';

export class SomethingMore extends Something {
}
`;

      const changed = `
import { SomethingElse }  from '../somewhere/else.model';

export class SomethingMore extends SomethingElse {
}
`;

      beforeEach(() => {
        file = getTypescriptFile(tree, PATH, og);
      });

      it('should skip extending usages by default', () => {
        file.replaceUsages(
          { text: 'Something', path: '/src/somewhere.model' },
          { text: 'SomethingElse', path: '/src/somewhere/else.model' },
        );
        file.refresh();
        expect(file.content).toBe(og);
      });

      it('should replace extending usages when skipIfExtending is false', () => {
        file.replaceUsages(
          { text: 'Something', path: '/src/somewhere.model' },
          { text: 'SomethingElse', path: '/src/somewhere/else.model' },
          false
        );
        file.refresh();
        expect(file.content).toBe(changed);
      });
    });
  });
});
