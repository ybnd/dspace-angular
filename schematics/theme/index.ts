import {
  apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, Tree, url,
} from '@angular-devkit/schematics';
import { Project } from '../+shared/source/project.model';
import { Module } from '../+shared/source/module.model';
import { normalize, strings } from '@angular-devkit/core';
import { asArrayLiteralString } from '../+shared/util';
import { TypescriptFile } from '../+shared/source/typescript-file.model';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { InsertChange } from '@schematics/angular/utility/change';
import { JsonFile } from '../+shared/source/json-file.model';
import { SourceFile } from '../+shared/source/file.model';

function insertEntryComponents(module: TypescriptFile, theme: string): void {
  const ENTRY_COMPONENTS = 'ENTRY_COMPONENTS';
  const ALIAS = theme.toUpperCase();

  const array = findNodes(module.source, ts.SyntaxKind.ArrayLiteralExpression).filter(
    array => (array.parent as any).name.escapedText === ENTRY_COMPONENTS
  )[0]

  const changes = [];
  changes.push(
    insertImport(
      module.source, module.path, `${ENTRY_COMPONENTS} as ${ALIAS}`,
      module.importPath(`./${theme}/entry-components`)
    )
  );
  changes.push(
    new InsertChange(
      module.path,
      array.end - 1,  // todo: this is fragile
      `  ...${ALIAS},\n`,
    )
  );
  module.apply(changes);
}

function themePath(theme: string, suffix?: string): string {
  if (suffix === undefined) {
    return `src/themes/${theme}`;
  } else {
    return `src/themes/${theme}/${suffix}`;
  }
}

export default function (options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = new Project(tree);
    project.assertDSpaceAngular({ withThemeSupport: true })

    // Create a new theme directory & initialize theme module based on a base theme (default: custom)
    const baseThemeModule = new Module(tree, themePath(options.baseTheme, `theme.module.ts`));
    const ngModuleImports = baseThemeModule.ngModuleImports;

    const newThemeModule = themePath(options.name, '/theme.module.ts');

    const filesFromTemplates = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
        importSection: ngModuleImports.getSection({ path: newThemeModule }),
        ngModuleImports: asArrayLiteralString(ngModuleImports.identifiers, { overIndentBy: 1, doQuote: false }),
      }),
      move(normalize(themePath(options.name))),
    ]);

    // Import the new theme's entry components in themed-entry-component.module.ts
    const entryComponentsModule = new TypescriptFile(tree, 'src/themes/themed-entry-component.module.ts')
    insertEntryComponents(entryComponentsModule, options.name);

    // Copy over SCSS from base theme (defaut: custom)
    const baseStylesDir = themePath(options.baseTheme, 'styles');
    for (const path of tree.getDir(baseStylesDir).subfiles) {
      const file = new SourceFile(tree, baseStylesDir + '/' + path);
      tree.create(themePath(options.name, `/styles/${path}`), file.content);
    }

    // Add .gitkeep to asset dirs
    tree.create(themePath(options.name, `/assets/fonts/.gitkeep`), '');
    tree.create(themePath(options.name, `/assets/images/.gitkeep`), '');

    // Add to angular.json
    const angularJson = new JsonFile(tree, 'angular.json');
    angularJson.modify((obj: any) => {
      obj.projects['dspace-angular'].architect.build.options.styles.push({
        input: themePath(options.name, `styles/theme.scss`),
        inject: false,
        bundleName: `${options.name}-theme`,
      });
      return obj;
    });

    return chain([
      mergeWith(filesFromTemplates),
    ]);
  }
}
