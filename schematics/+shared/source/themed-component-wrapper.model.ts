import { DerivedComponent } from './derived-component.model';
import { basename } from 'path';
import { Component } from './component.model';
import * as ts from 'typescript';
import { ImportList } from './import-list.model';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { THEMED_COMPONENT } from '../dspace';

export class ThemedComponentWrapper extends DerivedComponent {
  get selector(): string {
    return 'ds-themed-' + this.base.selector.replace(/^ds-/, '');
  }

  get className(): string {
    return 'Themed' + this.base.className;
  }

  get fileName(): string {
    return 'themed-' + this.base.fileName;
  }

  get dir(): string {
    return this.base.dir;
  }

  get path(): string {
    return this.dir + '/themed-' + basename(this.base.path);
  }

  /**
   * @returns
   */
  get importsAndProperties(): [string, string]  {
    const imports = new ImportList(this.base.tree);

    imports.add({
      text: 'Component',
      path: '@angular/core',
    });
    imports.add({
      text: 'ThemedComponent',
      path: THEMED_COMPONENT,
    });
    imports.add({
      text: this.base.className,
      path: this.base.path,
    });

    const properties = [];
    const ios = this.base.findInputsAndOutputs();

    const inAndOutputNames = [];

    for (const io of ios) {
      inAndOutputNames.push(`'${(io.parent.name as ts.Identifier).escapedText}'`);

      findNodes(io.parent, ts.SyntaxKind.Identifier)
        .filter(identifier => identifier !== io.parent.name)
        .forEach((identifier: ts.Identifier) => {
          imports.add(this.base.getIdentifierImport(identifier.escapedText as string))
        });

      properties.push(io.parent.getText(this.base.source));
    }

    if (inAndOutputNames.length > 0) {
      properties.unshift(
        `protected inAndOutputNames: (keyof ${this.base.className} & keyof this)[] = [${inAndOutputNames.join(', ')}];`
      );
    }

    let propertiesSection = properties.join('\n\n  ');
    if (propertiesSection.trim() != '') {
      propertiesSection = '\n  ' + propertiesSection + '\n';
    }

    return [
      imports.getSection(this.base),
      propertiesSection,
    ];
  }
}
