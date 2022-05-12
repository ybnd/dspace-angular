import { ISymbol } from './interfaces';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { findFileByName, resolveComponentName } from './util';

export const SRC = '/src';
export const APP = '/app';
export const THEMES = '/src/themes/';
export const THEMED_COMPONENT = '/src/app/shared/theme-support/themed.component';
export const DECLARATIONS = 'DECLARATIONS';

export function isInSrcApp(path: string): boolean {
  return path.startsWith(SRC + APP);
}

export enum EntryComponentDecoratorArgumentType {
  COPY, COPY_OR_DEFAULT, THEME
}

export interface IEntryComponentDecoratorArgument {
  readonly type: EntryComponentDecoratorArgumentType;
  readonly defaultValue?: string;
  readonly symbol?: ISymbol;
}

export interface IEntryComponentDecorator extends ISymbol {
  readonly arguments: IEntryComponentDecoratorArgument[];
}

function copyArgument({defaultValue, symbol}: {
  defaultValue?: string,
  symbol?: ISymbol
} = {}): IEntryComponentDecoratorArgument {
  return {
    type: defaultValue === undefined && symbol === undefined
      ? EntryComponentDecoratorArgumentType.COPY
      : EntryComponentDecoratorArgumentType.COPY_OR_DEFAULT,
    defaultValue: defaultValue !== undefined
      ? defaultValue
      : symbol?.text,
    symbol
  }
}

function themeArgument(): IEntryComponentDecoratorArgument {
  return {
    type: EntryComponentDecoratorArgumentType.THEME,
  }
}

export const THEMEABLE_ENTRY_COMPONENT_DECORATORS = [
  {
    text: 'listableObjectComponent',
    path: '/src/app/shared/object-collection/shared/listable-object/listable-object.decorator',
    arguments: [
      copyArgument(),
      copyArgument(),
      copyArgument({
        defaultValue: 'Context.Any',
        symbol: {
          text: 'Context',
          path: '/src/app/core/shared/context.model',
        }
      }),
      themeArgument(),
    ],
  },
  {
    text: 'metadataRepresentationComponent',
    path: '/src/app/shared/metadata-representation/metadata-representation.decorator',
    arguments: [
      copyArgument(),
      copyArgument(),
      copyArgument({
        symbol: {
          text: 'DEFAULT_CONTEXT',
          path: '/src/app/shared/metadata-representation/metadata-representation.decorator',
        }
      }),
      themeArgument(),
    ]
  }
] as IEntryComponentDecorator[];

export function findComponentPath(tree: Tree, cmp: string): string {
  const target = dasherize(resolveComponentName(cmp)) + '.component.ts';
  const path = findFileByName(tree.getDir(SRC), (path) => path === target);

  if (path === null) {
    throw new SchematicsException(`No such component: ${classify(resolveComponentName(cmp))}`);
  } else {
    return path;
  }
}
