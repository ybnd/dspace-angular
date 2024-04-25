/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';

import { isUnitTestFile } from '../../util/misc';
import { DSpaceESLintRuleInfo } from '../../util/structure';
import { getFilename } from '../../util/typescript';

export enum Message {
  DUPLICATE_DECORATOR = 'duplicateDecoratorCall',
}

export const info = {
  name: 'unique-decorators',
  meta: {
    docs: {
      description: 'Some decorators must be called with unique arguments (e.g. when they construct a mapping based on the argument values)',
    },
    messages: {
      [Message.DUPLICATE_DECORATOR]: 'Duplicate decorator call',
    },
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          decorators: {
            type: 'array',
          },
        },
      },
    ],
  },
  defaultOptions: [
    {
      decorators: [
        'listableObjectComponent',  // todo: must take default arguments into account!
        'rendersSectionForMenu',
        'rendersMenuItemForType',
        'dataService',
      ],
    },
  ],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>, options: any) {
    // todo: only works accross a single file -- refactor into shared registry
    const decoratorCalls: Map<string, Set<string>> = new Map();
    const filename = getFilename(context);

    function callKey(node: TSESTree.CallExpression): string {
      let key = '';

      for (const arg of node.arguments) {
        switch ((arg as TSESTree.Node).type) {
          // todo: can we make this more generic somehow?
          case AST_NODE_TYPES.Identifier:
            key += (arg as TSESTree.Identifier).name;
            break;
          case AST_NODE_TYPES.Literal:
            key += (arg as TSESTree.Literal).raw;
            break;
          case AST_NODE_TYPES.MemberExpression:
            key += (arg as any).object.name + '.' + (arg as any).property.name;
            break;
          default:
            throw new Error(`Unrecognized decorator argument type: ${arg.type}`);
        }

        key += ', ';
      }

      return key;
    }

    function isUnique(node: TSESTree.CallExpression): boolean {
      const decorator = (node.callee as TSESTree.Identifier).name;

      if (!decoratorCalls.has(decorator)) {
        decoratorCalls.set(decorator, new Set());
      }

      const key = callKey(node);

      let unique = true;

      if (decoratorCalls.get(decorator)?.has(key)) {
        unique = !unique;
      }

      decoratorCalls.get(decorator)?.add(key);

      return unique;
    }

    return {
      'ClassDeclaration > Decorator > CallExpression': (node: TSESTree.CallExpression) => {  // todo: limit to class decorators
        if (isUnitTestFile(filename)) {
          return;
        }

        if (node.callee.type !== AST_NODE_TYPES.Identifier) {
          // We only support regular method identifiers
          return;
        }

        // todo: can we fold this into the selector actually?
        if (!(options[0].decorators as string[]).includes(node.callee.name)) {
          // We don't care about this decorator
          return;
        }

        if (!isUnique(node)) {
          context.report({
            messageId: Message.DUPLICATE_DECORATOR,
            node: node,
          });
        }
      },
    };
  },
});

export const tests = {
  valid: [
    {
      name: 'checked decorator, no repetitions',
      code: `
@listableObjectComponent(a)
export class A {
}

@listableObjectComponent(a, 'b')
export class B {
}

@listableObjectComponent(a, 'b', 3)
export class C {
}

@listableObjectComponent(a, 'b', 3, Enum.TEST1)
export class C {
}

@listableObjectComponent(a, 'b', 3, Enum.TEST2)
export class C {
}
      `,
    },
    {
      name: 'unchecked decorator, some repetitions',
      code: `
@something(a)
export class A {
}

@something(a)
export class B {
}
      `,
    },
  ],
  invalid: [
    {
      name: 'checked decorator, some repetitions',
      code: `
@listableObjectComponent(a)
export class A {
}

@listableObjectComponent(a)
export class B {
}
      `,
      errors: [
        {
          messageId: 'duplicateDecoratorCall',
        },
      ],
    },
  ],
};
