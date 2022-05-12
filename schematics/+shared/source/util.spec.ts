import { Tree } from '@angular-devkit/schematics';
import { Component } from './component.model';
import * as ts from 'typescript';
import { Module } from './module.model';
import { TypescriptFile } from './typescript-file.model';

export function getTypescriptFile(tree: Tree, path: string, content: string): TypescriptFile {
  tree.create(path, content);
  return new TypescriptFile(tree, path);
}

export function getComponent(tree: Tree, path: string, content: string) {
  tree.create(path, content);
  return new Component(tree, path);
}

export function getModule(tree: Tree, path: string, content: string): Module {
  tree.create(path, content);
  return new Module(tree, path);
}

export function matchDecorators(nodes: any[], decorator: string, N: number): void {
  expect(nodes.length).toBe(N);
  nodes.forEach(node => {
    expect(node.kind).toBe(ts.SyntaxKind.Decorator);

    const expression = node.expression.escapedText || node.expression.expression.escapedText;
    expect(expression).toBe(decorator);
  });
}
