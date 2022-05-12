import { Tree } from '@angular-devkit/schematics';
import { Component } from './component.model';
import { Module } from './module.model';
import { ISymbol } from '../interfaces';
import { getComponent, getModule, matchDecorators } from './util.spec';

describe('Component', () => {
  let tree: Tree;
  let component: Component;

  beforeEach(() => {
    tree = Tree.empty();
  });

  describe('metadata', () => {
    beforeEach(() => {
      component = getComponent(tree, '/src/app/test/test.component.ts', `
import { Component, OnInit } from '@angular/core';
import { someAnimation, someOtherAnimation } from '../somewhere/animations.ts';

@Component({
  selector: 'test-selector',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  animations: [someAnimation, someOtherAnimation],
})
export class TestComponent implements OnInit {
  public ngOnInit(): void {
    // noop
  }
}
      `);
    });

    it('should provide the correct className', () => {
      expect(component.className).toBe('TestComponent');
    });

    it('should provide the correct selector', () => {
      expect(component.selector).toBe('test-selector');
    });

    it('should provide correct paths', () => {
      expect(component.templateUrl).toBe('./test.component.html');
      expect(component.styleUrls).toEqual(['./test.component.scss']);
    });

    it('should be an importable symbol', () => {
      expect((component as ISymbol).text).toBe('TestComponent');
      expect((component as ISymbol).path).toBe('/src/app/test/test.component.ts');
    });

    it('should provide correct animations', () => {
      expect(component.animations).toEqual(['someAnimation', 'someOtherAnimation']);
    });
  });

  describe('getDecoratorNodes', () => {
    beforeEach(() => {
      component = getComponent(tree, '/src/app/test/test.component.ts', `
import { Component, OnInit, Input, Output } from '@angular/core';
import { someDecorator, someOtherDecorator } from '../somewhere/decorators.ts';

@someDecorator()
@Component({
  selector: 'test-selector',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
  @Input() test;
  @Input() test2;
  @Input() test3;

  // @Output() testOutput; // should not get picked up since it's a comment

  public ngOnInit(): void {
    // noop
  }
}
      `);
    });

    it('should return array of AST node(s) if decorator is present', () => {
      matchDecorators(component.getDecoratorNodes('someDecorator'), 'someDecorator', 1);
      matchDecorators(component.getDecoratorNodes('Component'), 'Component', 1);
      matchDecorators(component.getDecoratorNodes('Input'), 'Input', 3);
    });

    it('should return empty array if decorator is not present', () => {
      expect(component.getDecoratorNodes('someOtherDecorator')).toEqual([]);
      expect(component.getDecoratorNodes('Output')).toEqual([]);
    });
  });

  describe('findInputsAndOutputs', () => {
    it('should return an empty array if component has no i/o', () => {
      component = getComponent(tree, '/src/app/test/test.component.ts', `
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'test-selector',
  templateUrl: './test.component.html',
})
export class TestComponent {
  // @Input() test;        // should not get picked up since it's a comment
  // @Output() testOutput; // should not get picked up since it's a comment
}
      `);
      expect(component.findInputsAndOutputs()).toEqual([]);
    });

    it('should return an array of i/o decorator nodes', () => {
      component = getComponent(tree, '/src/app/test/test.component.ts', `
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'test-selector',
  templateUrl: './test.component.html',
})
export class TestComponent {
  @Input() test;
  @Input() test2;
  @Input() test3;
  @Output() testOutput;
}
      `);
      const io = component.findInputsAndOutputs();
      expect(io.length).toBe(4);
      matchDecorators(io.slice(0,3), 'Input', 3);
      matchDecorators(io.slice(3), 'Output', 1);
    });
  });

  describe('findDeclaringModule', () => {
    let module: Module;

    const MODULE = `
import { NgModule } from '@angular/core';
import { TestComponent } from './test.component';

@NgModule({
  declarations: [
    TestComponent,
  ],
})
export class TestModule {
}
    `;

    const ROUTING_MODULE = `
import { NgModule } from '@angular/core';
import { TestComponent } from './test.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '/test',
        component: TestComponent,
      }
  ]
})
export class RoutingModule {
}
    `;

    beforeEach(() => {
      component = getComponent(tree, '/src/app/test/test.component.ts', `
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'test-selector',
  templateUrl: './test.component.html',
})
export class TestComponent {
}
      `);
    });

    it('should return declaring module as a Module object', () => {
      module = getModule(tree, '/src/app/test/test.module.ts', MODULE);

      const declaringModule = component.findDeclaringModule();
      expect(declaringModule).toBeTruthy();
      expect(declaringModule?.path).toEqual(module.path);
    });

    it('should skip routing modules', () => {
      module = getModule(tree, '/src/app/test/test.module.ts', MODULE);
      const routingModule = getModule(tree, '/src/app/test/routing.module.ts', ROUTING_MODULE);

      const declaringModule = component.findDeclaringModule();
      expect(declaringModule).toBeTruthy();
      expect(declaringModule?.path).not.toEqual(routingModule.path);
      expect(declaringModule?.path).toEqual(module.path);
    });

    it('should return null if only used in routing module', () => {
      getModule(tree, '/src/app/test/routing.module.ts', ROUTING_MODULE);

      const declaringModule = component.findDeclaringModule();
      expect(declaringModule).toBeFalsy();
    });

    it('should return null if no declaring module can be found', () => {
      const orphan = getComponent(tree, '/src/app/test/orphan.component.ts', `
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'orphan-selector',
  templateUrl: './orphan.component.html',
})
export class OrphanComponent {
}
      `);

      const declaringModule = orphan.findDeclaringModule();
      expect(declaringModule).toBeFalsy();
    });
  });
});
