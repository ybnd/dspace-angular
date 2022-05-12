import { DirEntry, FileEntry, Tree } from '@angular-devkit/schematics';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import {
  applyToUpdateRecorder, Change, InsertChange, NoopChange, ReplaceChange,
} from '@schematics/angular/utility/change';
import * as ts from 'typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { IAlias, ISymbol } from './interfaces';

export function regexify(v: string): string {
  v = v.replace('.', '\.');
  return v;
}

export function stripQuotes(str: string) {
  return str.replace(/^['"`](.*)['"`]$/, '$1');
}

export function stripExtension(path: string, extension: string): string {
  return path.replace(new RegExp(extension + '$'), '');
}

export function findFileByName(
  directory: DirEntry,
  fileMatchesCriteria: (file: string) => boolean
): string | null {
  const pathFragment = directory.subfiles.find(fileMatchesCriteria);

  if (pathFragment) {
    const fileEntry = directory.file(pathFragment);

    if (fileEntry) {
      return fileEntry.path;
    }
  }

  for (const pathFragment of directory.subdirs) {
    const fileEntry = findFileByName(directory.dir(pathFragment), fileMatchesCriteria);
    if (fileEntry !== null) {
      return fileEntry;
    }
  }

  return null;
}

export function resolveComponentName(cmp: string): string {
  cmp = dasherize(cmp).replace(/\.component(\.ts)?$/, '');
  return classify(cmp).replace(/Component$/, '');
}

export function applyChanges(tree: Tree, file: FileEntry, changes: Change[]): void {
  const recorder = tree.beginUpdate(file.path);
  applyToUpdateRecorder(recorder, changes);
  tree.commitUpdate(recorder);
}

export function insertAfterArrayLiteralEntry(path: string, node: ts.Node, text: string): Change {
  if (node.parent.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return new NoopChange();
  }

  return new InsertChange(path, node.getEnd(), `,\n  ${text}`); // todo: conserve newlines / indentation
}

export function appendIdentifierToArrayLiteral(
  source: ts.SourceFile, node: ts.ArrayLiteralExpression, text: string,
  { overIndentBy, skipDuplicate, }: {
    overIndentBy?: number,
    skipDuplicate?: boolean,
  } = { overIndentBy: 0, skipDuplicate: true },
): Change {
  if (skipDuplicate) {
    const existingEntries = findNodes(source, ts.SyntaxKind.Identifier).filter(
      (node) => (node as ts.Identifier).escapedText === text
    );
    if (existingEntries.length > 0) {
      return new NoopChange();
    }
  }

  const newNode = ts.factory.createArrayLiteralExpression([
    ...node.elements,
    ts.factory.createIdentifier(text + ','),  // todo: find a better way to ensure trailing comma
  ], true);

  return new ReplaceChange(
    source.fileName, node.getStart(), node.getText(source),
    print(newNode, source, overIndentBy)
  );
}

export function asArrayLiteralString(
  array: string[],
  { overIndentBy, doQuote }: {
    overIndentBy: number,
    doQuote: boolean
  } = {
    overIndentBy: 0,
    doQuote: true
  }): string {
  switch (array.length) {
    case 0: {
      return '[]';
    }
    case 1: {   // todo: be smarter about wrapping -- optional "how/if to wrap" param?
      if (doQuote) {
        return `['${array[0]}']`;
      } else {
        return `[${array[0]}]`;
      }
    }
    default: {
      let literalString = '[';
      array.forEach((element) => {
        if (doQuote) {
          element = '\'' + element + '\'';
        }
        literalString += '\n' + '  '.repeat(overIndentBy + 1) + element + ',';
      });
      literalString += '\n' + '  '.repeat(overIndentBy) + ']';
      return literalString;
    }
  }
}


export function getImportLine(symbols: string[], path: string) {
  return `import { ${symbols.join(', ')} } from '${path}';`
}

export function findAncestorNode<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind): T | null {
  let parent: ts.Node = node.parent;
  while (parent !== undefined) {
    if (parent.kind === kind) {
      return parent as T;
    } else {
      parent = parent.parent;
    }
  }
  return null;
}


const DEFAULT_TS_INDENT = / {4}/gm;

export function print(node: ts.Node, source: ts.SourceFile, overIndentBy = 0): string {
  const s = ts.createPrinter()
              .printNode(ts.EmitHint.Unspecified, node, source)
              .replace(DEFAULT_TS_INDENT, '  ');  // todo: don't see a decent way to set indentation width for printer
                                                  //       also: this should be configurable
  if (overIndentBy > 0) {
    return s.replace(/\n/g, '\n' + '  '.repeat(overIndentBy));
  } else {
    return s;
  }
}

export function importIdentifier(symbol: ISymbol | IAlias): string {
  if ('alias' in symbol && symbol.alias) {
    return `${symbol.text} as ${symbol.alias}`;
  } else {
    return symbol.text;
  }
}

export function modifyJsonFile(path: string, callback: (source: string) => string): void {

}
