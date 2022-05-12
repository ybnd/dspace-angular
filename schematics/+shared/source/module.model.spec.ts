import { Tree } from '@angular-devkit/schematics';
import { Module } from './module.model';
import { Component } from './component.model';
import { TestDerivedComponent } from './derived-component.model.spec';
import { ISymbol } from '../interfaces';
import { getComponent, getModule } from './util.spec';

const REGULAR_PATH = '/src/app/test/test.module.ts';
const REGULAR_MODULE = `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TestComponent,
  ],
})
export class TestModule {
}
`;
const REGULAR_MODULE_DECLARATIONS_CONST = `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';

const DECLARATIONS = [
  TestComponent,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
})
export class TestModule {
}
`;
const REGULAR_MODULE_NO_DECLARATIONS = `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';

@NgModule({
  imports: [
    CommonModule,
  ],
})
export class TestModule {
}
`;

const ROUTING_PATH = '/src/app/test/test-routing.module.ts';
const ROUTING_MODULE = `
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TestComponent } from './test.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '/test',
        component: TestComponent,
      }
    ]),
  ],
})
export class TestModule {
}
`;


const COMPONENT_PATH = '/src/test/test.component.ts';
const COMPONENT_CONTENT = `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'test-component',
  template: './test.component.html',
  styleUrls: ['./test.component.html'],
})
export class TestComponent implements OnInit {
  public ngOnInit(): void {
    // noop
  }
}
`;

describe('Module', () => {
  let tree: Tree;
  let module: Module;

  beforeEach(() => {
    tree = Tree.empty();
  });

  describe('isRoutingModule', () => {
    it('should return true if current module contains routing info and filename ends in routing.module.ts', () => {
      module = getModule(tree, ROUTING_PATH, ROUTING_MODULE);
      expect(module.isRoutingModule).toBe(true);
    });

    it('should return false if filename doesn\'t end in routing.module.ts', () => {
      module = getModule(tree, REGULAR_PATH, ROUTING_MODULE);
      expect(module.isRoutingModule).toBe(false);
    });

    it('should return false if module contains no routing info', () => {
      module = getModule(tree, ROUTING_PATH, REGULAR_MODULE);
      expect(module.isRoutingModule).toBe(false);
    });

    it('should be false if module contains no routing info and filename doesn\'t end in routing.module.ts', () => {
      module = getModule(tree, REGULAR_PATH, REGULAR_MODULE);
      expect(module.isRoutingModule).toBe(false);
    });
  });

  describe('insertDerivedComponentDeclaration', () => {
    let baseComponent: Component;
    let derivedComponent: TestDerivedComponent;

    beforeEach(() => {
      module = getModule(tree, REGULAR_PATH, REGULAR_MODULE);
      baseComponent = getComponent(tree, COMPONENT_PATH, COMPONENT_CONTENT);
      derivedComponent = new TestDerivedComponent(baseComponent);
    });

    it('should import derived component', () => {
      expect(module.content).not.toContain('TestDerived');
      expect(module.content).not.toContain('test-derived');

      module.insertDerivedComponentDeclaration(baseComponent, derivedComponent);

      expect(module.content).toContain(`import { TestDerivedTestComponent } from '../../test/derived/test-derived-test.component'`);
    });

    it('should declare derived component under the base component', () => {
      expect(module.content).not.toContain('TestDerived');
      expect(module.content).not.toContain('test-derived');

      module.insertDerivedComponentDeclaration(baseComponent, derivedComponent);

      expect(module.content).toMatch(/TestComponent,\n *TestDerivedTestComponent,/);
    });
  });

  describe('addDeclaration', () => {
    let symbol: ISymbol;

    beforeEach(() => {
      symbol = {
        path: '/src/app/test/somewhere/some.component.ts',
        text: 'SomeComponent',
      } as ISymbol;
    });

    it('should import the new class', () => {
      module = getModule(tree, REGULAR_PATH, REGULAR_MODULE);

      expect(module.content).not.toContain('SomeComponent');
      expect(module.content).not.toContain('some.component');

      module.addDeclaration(symbol);

      expect(module.content).toContain(`import { SomeComponent } from './somewhere/some.component'`);
    });

    it('should add declaration to the end of array literal in @NgModule', () => {
      module = getModule(tree, REGULAR_PATH, REGULAR_MODULE);

      expect(module.content).not.toContain('SomeComponent');
      expect(module.content).not.toContain('some.component');

      module.addDeclaration(symbol);

      expect(module.content).toMatch(/declarations: \[\n *TestComponent,\n *SomeComponent,\n *]/);
    });

    it('should add declaration to the end of array literal referenced in @NgModule', () => {
      module = getModule(tree, REGULAR_PATH, REGULAR_MODULE_DECLARATIONS_CONST);

      expect(module.content).not.toContain('SomeComponent');
      expect(module.content).not.toContain('some.component');

      module.addDeclaration(symbol);

      expect(module.content).toMatch(/const DECLARATIONS = \[\n *TestComponent,\n *SomeComponent,\n *]/);
    });

    it('should add declaration to a new array literal constant if this is the first one', () => {
      module = getModule(tree, REGULAR_PATH, REGULAR_MODULE_NO_DECLARATIONS);

      expect(module.content).not.toContain('declarations');
      expect(module.content).not.toContain('DECLARATIONS');
      expect(module.content).not.toContain('SomeComponent');
      expect(module.content).not.toContain('some.component');

      module.addDeclaration(symbol);

      expect(module.content).toMatch(/const DECLARATIONS = \[\n *SomeComponent,\n *]/);
      expect(module.content).toMatch("declarations: DECLARATIONS");
    });
  });
});
