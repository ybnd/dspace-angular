import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from '@typescript-eslint/utils';
import { RuleContext } from '@typescript-eslint/utils/ts-eslint';

import { fixture } from '../../../test/fixture';
import { isUnitTestFile } from '../../util/misc';
import { DSpaceESLintRuleInfo } from '../../util/structure';
import { getTheme } from '../../util/theme-support';
import { getFilename } from '../../util/typescript';

export enum Message {
  MISSING_THEME = 'noThemeDeclaredInThemeFile',
  WRONG_THEME = 'wrongThemeDeclaredInThemeFile',
  UNEXPECTED_THEME = 'themeDeclaredInNonThemeFile',
}

export const info = {
  name: 'themed-decorators',
  meta: {
    docs: {
      description: 'Entry components with theme support should declare the correct theme',
    },
    fixable: 'code',
    messages: {
      [Message.MISSING_THEME]: 'No theme declaration in decorator',
      [Message.WRONG_THEME]: 'Wrong theme declaration in decorator',
      [Message.UNEXPECTED_THEME]: 'There is a theme declaration in decorator, but this file is not part of a theme',
    },
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          decorators: {
            type: 'object',
          },
        },
      },
    ],
  },
  defaultOptions: [
    {
      decorators: {
        listableObjectComponent: 3,
        rendersSectionForMenu: 2,
      },
    },
  ],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: RuleContext<Message, any>, options: any) {
    const filename = getFilename(context);

    function getDeclaredTheme(decoratorCall: TSESTree.CallExpression): TSESTree.Node | undefined {
      const index = options[0].decorators[(decoratorCall.callee as any).name]; // todo: clean up

      if (decoratorCall.arguments.length >= index + 1) {
        return decoratorCall.arguments[index];
      }

      return undefined;
    }

    return {
      'ClassDeclaration > Decorator > CallExpression': (node: TSESTree.CallExpression) => {
        if (isUnitTestFile(filename)) {
          return;
        }

        if (node.callee.type !== AST_NODE_TYPES.Identifier) {
          // We only support regular method identifiers
          return;
        }

        // todo: can we fold this into the selector actually?
        if (!(node.callee.name in options[0].decorators)) {
          // We don't care about this decorator
          return;
        }

        const theme = getTheme(filename);
        const themeDeclaration = getDeclaredTheme(node as TSESTree.CallExpression);

        if (themeDeclaration === undefined) {
          if (theme !== undefined) {
            context.report({
              messageId: Message.MISSING_THEME,
              node: node,
              fix(fixer) {
                return fixer.insertTextAfter(node.arguments[node.arguments.length - 1], `, '${theme}'`);
              },
            });
          }
        } else if (themeDeclaration?.type === AST_NODE_TYPES.Literal) {
          if (theme === undefined) {
            context.report({
              messageId: Message.UNEXPECTED_THEME,
              node: themeDeclaration,
              fix(fixer) {
                const idx = node.arguments.findIndex((v) => v.range === themeDeclaration.range);

                if (idx === 0) {
                  return fixer.remove(themeDeclaration);
                } else {
                  const previousArgument = node.arguments[idx - 1];
                  return fixer.removeRange([previousArgument.range[1], themeDeclaration.range[1]]);  // todo: comma?
                }
              },
            });
          } else if (theme !== themeDeclaration?.value) {
            context.report({
              messageId: Message.WRONG_THEME,
              node: themeDeclaration,
              fix(fixer) {
                return fixer.replaceText(themeDeclaration, `'${theme}'`);
              },
            });
          }
        } else if (themeDeclaration?.type === AST_NODE_TYPES.Identifier && themeDeclaration.name === 'undefined') {
          if (theme !== undefined) {
            context.report({
              messageId: Message.MISSING_THEME,
              node: node,
              fix(fixer) {
                return fixer.replaceText(node.arguments[node.arguments.length - 1], `'${theme}'`);
              },
            });
          }
        } else {
          throw new Error('Unexpected theme declaration');
        }
      },
    };
  },
});

export const tests = {
  valid: [
    {
      name: 'theme file declares the correct theme in @listableObjectComponent',
      code: `
@listableObjectComponent(something, somethingElse, undefined, 'test')
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/themes/test/app/test/test-themeable.component.ts'),
    },
    {
      name: 'plain file declares no theme in @listableObjectComponent',
      code: `
@listableObjectComponent(something, somethingElse, undefined)
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/app/test/test.component.ts'),
    },
    {
      name: 'plain file declares explicit undefined theme in @listableObjectComponent',
      code: `
@listableObjectComponent(something, somethingElse, undefined, undefined)
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/app/test/test.component.ts'),
    },
    {
      name: 'test file declares theme outside of theme directory',
      code: `
@listableObjectComponent(something, somethingElse, undefined, 'test')
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/app/test/test.component.spec.ts'),
    },
    {
      name: 'only track configured decorators',
      code: `
@something('test')
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/app/test/test.component.ts'),
    },
  ],
  invalid: [
    {
      name: 'theme file declares the wrong theme in @listableObjectComponent',
      code: `
@listableObjectComponent(something, somethingElse, undefined, 'best')
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/themes/test/app/test/test-themeable.component.ts'),
      errors: [
        {
          messageId: 'wrongThemeDeclaredInThemeFile',
        },
      ],
      output: `
@listableObjectComponent(something, somethingElse, undefined, 'test')
export class Something extends SomethingElse {
}
        `,
    },
    {
      name: 'plain file declares a theme in @listableObjectComponent',
      code: `
@listableObjectComponent(something, somethingElse, undefined, 'atmire')
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/app/test/test.component.ts'),
      errors: [
        {
          messageId: 'themeDeclaredInNonThemeFile',
        },
      ],
      output: `
@listableObjectComponent(something, somethingElse, undefined)
export class Something extends SomethingElse {
}
        `,
    },
    {
      name: 'theme file declares no theme in @listableObjectComponent',
      code: `
@listableObjectComponent(something, somethingElse, undefined)
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/themes/test/app/test/test-themeable.component.ts'),
      errors: [
        {
          messageId: 'noThemeDeclaredInThemeFile',
        },
      ],
      output: `
@listableObjectComponent(something, somethingElse, undefined, 'test')
export class Something extends SomethingElse {
}
        `,
    },
    {
      name: 'theme file declares explicit undefined theme in @listableObjectComponent',
      code: `
@listableObjectComponent(something, somethingElse, undefined, undefined)
export class Something extends SomethingElse {
}
        `,
      filename: fixture('src/themes/test/app/test/test-themeable.component.ts'),
      errors: [
        {
          messageId: 'noThemeDeclaredInThemeFile',
        },
      ],
      output: `
@listableObjectComponent(something, somethingElse, undefined, 'test')
export class Something extends SomethingElse {
}
        `,
    },
  ],
};
