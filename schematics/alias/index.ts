import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Project } from '../+shared/source/project.model';
import * as aliases from './aliases.json';

export default function(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = new Project(tree);
    project.assertDSpaceAngular({ withThemeSupport: true })

    console.log('Aliasing:')
    aliases.forEach(alias => {  // todo: filter out stuff that doesn't match the interface & complain
      console.log(`  ${alias.path} ${alias.text} → ${alias.alias}`)
    })

    project.applyToTypescriptFiles(file => file.aliasImports(aliases));
  }
}
