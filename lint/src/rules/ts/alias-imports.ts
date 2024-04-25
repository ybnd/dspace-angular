/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  ESLintUtils,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';

import { removeWithCommas } from '../../util/fix';
import { DSpaceESLintRuleInfo } from '../../util/structure';
import {
  findUsages,
  getSourceCode,
  hasExactImport,
} from '../../util/typescript';

export enum Message {
  NO_ALIAS = 'noAlias',
  WRONG_ALIAS = 'wrongAlias',
}

export const info = {
  name: 'alias-imports',
  meta: {
    docs: {
      description: 'Unclear imports should be aliased for clarity',
    },
    messages: {
      noAlias: 'This import must be aliased to {{ local }}',
      wrongAlias: 'This import uses the wrong alias (should be {{ local }})',
    },
    fixable: 'code',
    type: 'problem',
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            package: { type: 'string' },
            imported: { type: 'string' },
            local: { type: 'string' },
          },
        },
      },
    ],
  },
  defaultOptions: [
    [
      {
        package: 'rxjs',
        imported: 'of',
        local: 'observableOf',
      },
    ],
  ],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>, options: any) {
    const source = getSourceCode(context);

    function findOption(importPackage: string, importTarget: string): string {
      for (const option of options[0]) {
        if (option.package === importPackage && option.imported === importTarget) {
          return option;
        }
      }
      throw new Error(`No configuration for import { ${importTarget} } from '${importPackage}';`);
    }

    function handleUnaliasedImport(node: TSESTree.ImportSpecifier) {
      const option: any = findOption((node.parent as TSESTree.ImportDeclaration).source.value, node.imported.name);

      if (node.local.name === node.imported.name) {
        context.report({
          messageId: Message.NO_ALIAS,
          data: { local: option.local },
          node: node,
          fix(fixer) {
            if (hasExactImport(context, option.package, option.imported, option.local)) {
              return removeWithCommas(context, fixer, node);
            } else {
              return fixer.replaceText(node.local, `${option.imported} as ${option.local}`);
            }
          },
        });
        handleUsages(node, Message.NO_ALIAS, option.local);
      } else {
        context.report({
          messageId: Message.WRONG_ALIAS,
          data: { local: option.local },
          node: node,
          fix(fixer) {
            if (hasExactImport(context, option.package, option.imported, option.local)) {
              return removeWithCommas(context, fixer, node);
            } else {
              return fixer.replaceText(node.local, option.local);
            }
          },
        });
        handleUsages(node, Message.WRONG_ALIAS, option.local);
      }
    }

    function handleUsages(node: TSESTree.ImportSpecifier, messageId: Message, changeTo: string) {
      for (const usage of findUsages(context, node.local, true)) {
        context.report({
          messageId,
          data: { local: changeTo },
          node: usage,
          fix(fixer) {
            return fixer.replaceText(usage, changeTo);
          },
        });
      }
    }

    return options[0].reduce((selectors: any, option: any) => {
      selectors[`ImportDeclaration[source.value = "${option.package}"] > ImportSpecifier[imported.name = "${option.imported}"][local.name != "${option.local}"]`] = handleUnaliasedImport;
      return selectors;
    }, {});
  },
});

export const tests = {
  valid: [
    {
      name: 'correctly aliased imports',
      code: `
import { of as observableOf } from 'rxjs';
        `,
    },
  ],
  invalid: [
    {
      name: 'imports without alias',
      code: `
import { of } from 'rxjs';
const thing$ = of('thing');
      `,
      errors: [
        {
          messageId: 'noAlias',
        },
        {
          messageId: 'noAlias',
        },
      ],
      output: `
import { of as observableOf } from 'rxjs';
const thing$ = observableOf('thing');
      `,
    },
    {
      name: 'imports with and without alias',
      code: `
import { of, of as observableOf } from 'rxjs';
const thing1$ = of('thing1');
const thing2$ = observableOf('thing2');
      `,
      errors: [
        {
          messageId: 'noAlias',
        },
        {
          messageId: 'noAlias',
        },
      ],
      output: `
import { of as observableOf } from 'rxjs';
const thing1$ = observableOf('thing1');
const thing2$ = observableOf('thing2');
      `,
    },
    {
      name: 'imports with and without alias (multiline, reverse order)',
      code: `
import {
  of as observableOf,
  of,
} from 'rxjs';
const thing1$ = of('thing1');
const thing2$ = observableOf('thing2');
      `,
      errors: [
        {
          messageId: 'noAlias',
        },
        {
          messageId: 'noAlias',
        },
      ],
      output: `
import {
  of as observableOf,
} from 'rxjs';
const thing1$ = observableOf('thing1');
const thing2$ = observableOf('thing2');
      `,
    },
    {
      name: 'imports under the wrong alias',
      code: `
import { of as ofSomething } from 'rxjs';
const thing$ = ofSomething('thing');
      `,
      errors: [
        {
          messageId: 'wrongAlias',
        },
        {
          messageId: 'wrongAlias',
        },
      ],
      output: `
import { of as observableOf } from 'rxjs';
const thing$ = observableOf('thing');
      `,
    },
    {
      name: 'respect tokens that look like usages',
      code: `
import { of as ofSomething } from 'rxjs';
const thing$ = ofSomething('thing');
for (const a of Array.of(1,2,3)) {
  console.log(a);
}
      `,
      errors: [
        {
          messageId: 'wrongAlias',
        },
        {
          messageId: 'wrongAlias',
        },
      ],
      output: `
import { of as observableOf } from 'rxjs';
const thing$ = observableOf('thing');
for (const a of Array.of(1,2,3)) {
  console.log(a);
}
      `,
    },
  ],
};
