import {
  apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url,
} from '@angular-devkit/schematics';
import { Project } from '../+shared/source/project.model';
import { asArrayLiteralString, resolveComponentName } from '../+shared/util';
import { findComponentPath, isInSrcApp } from '../+shared/dspace';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Component } from '../+shared/source/component.model';
import { ThemedComponentWrapper } from '../+shared/source/themed-component-wrapper.model';
import { normalize, strings } from '@angular-devkit/core';
import { dirname } from 'path';
import { ThemedComponent } from '../+shared/source/themed-component.model';
import { importPath } from '../+shared/paths';

export default function(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = new Project(tree);
    project.assertDSpaceAngular({ withThemeSupport: true })

    if (!project.hasTheme(options.theme)) {
      throw new SchematicsException(`No such theme: '${options.theme}'`);
    }

    options.name = resolveComponentName(options.name);
    const path = findComponentPath(tree, options.name);

    if (!isInSrcApp(path)) {
      throw new SchematicsException(`'${classify(options.name)}Component' is not in src/app/`);
    }

    const baseComponent = new Component(tree, path);
    const themedComponent = new ThemedComponent(baseComponent, options.theme);

    if (!baseComponent.isEntryComponent && !new ThemedComponentWrapper(baseComponent).exists) {
      throw new SchematicsException(
        `Component '${baseComponent.className}' is not themeable; run the 'themeable' schematic first.`
      );
    }

    const sections = themedComponent.getSections(context);

    const filesFromTemplates = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
        selector: baseComponent.selector,
        imports: sections.imports,
        decorators: sections.decorators,
        animations: sections.animations,
        baseComponentPath: importPath(baseComponent.path, themedComponent.path),
        templateUrl: themedComponent.templateUrl,
        styleUrls: asArrayLiteralString(themedComponent.styleUrls, { overIndentBy: 1, doQuote: true }),
      }),
      move(normalize(dirname(themedComponent.path))),
    ]);

    themedComponent.declare();

    return chain([
      mergeWith(filesFromTemplates),
    ]);
  }
}
