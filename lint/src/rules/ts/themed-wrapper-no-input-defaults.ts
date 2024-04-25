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

import { DSpaceESLintRuleInfo } from '../../util/structure';
import { isThemedComponentWrapper } from '../../util/theme-support';

export enum Message {
  HAS_INPUT_DEFAULTS = 'wrapperHasInputDefaults',
}

export const info = {
  name: 'themed-wrapper-no-input-defaults',
  meta: {
    docs: {
      description: 'ThemedComponent wrappers should not declare input defaults (see [DSpace Angular #2164](https://github.com/DSpace/dspace-angular/pull/2164))',
    },
    messages: {
      [Message.HAS_INPUT_DEFAULTS]: 'ThemedComponent wrapper declares inputs with defaults',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>) {
    return {
      'ClassBody > PropertyDefinition > Decorator > CallExpression[callee.name=\'Input\']': (node: TSESTree.CallExpression) => {
        const classDeclaration = (node?.parent?.parent?.parent as TSESTree.Decorator);  // todo: clean this up
        if (!isThemedComponentWrapper(classDeclaration)) {
          return;
        }

        const propertyDefinition: TSESTree.PropertyDefinition = (node.parent.parent as any);  // todo: clean this up

        if (propertyDefinition.value !== null) {
          context.report({
            messageId: Message.HAS_INPUT_DEFAULTS,
            node: propertyDefinition,
            // fix(fixer) {
            //   // todo: don't strip type annotations!
            //   // todo: replace default with appropriate type annotation if not present!
            //   return fixer.removeRange([propertyDefinition.key.range[1], (propertyDefinition.value as any).range[1]]);
            // }
          });
        }
      },
    };
  },
});

export const tests = {
  valid: [
    {
      name: 'ThemedComponent wrapper defines an input without a default value',
      code: `
export class TTest extends ThemedComponent<Test> {

@Input()
test;
}
      `,
    },
    {
      name: 'Regular class defines an input with a default value',
      code: `
export class Test {

@Input()
test = 'test';
}
      `,
    },
  ],
  invalid: [
    {
      name: 'ThemedComponent wrapper defines an input with a default value',
      code: `
export class TTest extends ThemedComponent<Test> {

@Input()
test1 = 'test';

@Input()
test2 = true;

@Input()
test2: number = 123;

@Input()
test3: number[] = [1,2,3];
}
      `,
      errors: [
        {
          messageId: 'wrapperHasInputDefaults',
        },
        {
          messageId: 'wrapperHasInputDefaults',
        },
        {
          messageId: 'wrapperHasInputDefaults',
        },
        {
          messageId: 'wrapperHasInputDefaults',
        },
      ],
    },
    {
      name: 'ThemedComponent wrapper defines an input with an undefined default value',
      code: `
export class TTest extends ThemedComponent<Test> {

@Input()
test = undefined;
}
      `,
      errors: [
        {
          messageId: 'wrapperHasInputDefaults',
        },
      ],
    },
  ],
};
