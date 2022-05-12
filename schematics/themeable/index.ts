import {
  apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url,
} from '@angular-devkit/schematics';
import { resolveComponentName } from '../+shared/util';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { normalize, strings } from '@angular-devkit/core';
import { findComponentPath, isInSrcApp, THEMED_COMPONENT } from '../+shared/dspace';
import { Component } from '../+shared/source/component.model';
import { ThemedComponentWrapper } from '../+shared/source/themed-component-wrapper.model';
import { Project, RE_HTML } from '../+shared/source/project.model';
import { backpedal, fromSrc } from '../+shared/paths';

export default function(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = new Project(tree);

    project.assertDSpaceAngular({ withThemeSupport: true });

    options.name = resolveComponentName(options.name);
    const path = findComponentPath(tree, options.name);

    if (!isInSrcApp(path)) {
      throw new SchematicsException(`'${classify(options.name)}Component' is not in src/app/`);
    }

    if (path === '/src/app' + THEMED_COMPONENT) {
      throw new SchematicsException('Please don\'t try to make ThemedComponent themeable, that doesn\'t make sense.');
    }

    const baseComponent = new Component(tree, path);

    if (baseComponent.isEntryComponent) {
      throw new SchematicsException(
        `'${classify(options.name)}Component' is an entry component and doesn't need a ThemedComponent wrapper`
      );
    }

    const themeableComponent = new ThemedComponentWrapper(baseComponent);

    if (themeableComponent.exists) {
      throw new SchematicsException(
        `'${classify(options.name)}Component' already has a ThemedComponent wrapper`
      );
    }

    const src = backpedal(baseComponent.dir, 'src');

    const [imports, properties] = themeableComponent.importsAndProperties;

    const filesFromTemplates = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
        src,
        fromSrc: fromSrc(baseComponent.dir),
        themedComponentPath: baseComponent.importPath(THEMED_COMPONENT),
        imports,
        properties,
      }),
      move(normalize(baseComponent.dir)),
    ]);

    const module = project.findDeclaringModule(baseComponent);
    if (module !== null) {
      module.insertUnderExistingDeclaration(baseComponent, themeableComponent);
      const skip = [
        baseComponent.path,
        themeableComponent.path,
        module.path,
      ];

      project.replaceTypescriptUsages('/src/app', true, skip, baseComponent, themeableComponent);
      project.replace('/src/app', RE_HTML, skip, [
        {
          searchValue: new RegExp('(\<\/?)' + baseComponent.selector + '( |\t|\n|\>)', 'gm'),  // todo: this can miss some usages!
          replaceValue: '$1' + themeableComponent.selector + '$2',
        }
      ]);
    } else {
      throw new SchematicsException(`Couldn't find the module declaring '${baseComponent.className}'`);
    }

    return chain([
      mergeWith(filesFromTemplates),
    ]);
  };
}
