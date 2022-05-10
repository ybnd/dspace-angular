import { Component } from './component.model';
import { IFile, ISymbol } from '../interfaces';
import { relative } from 'path';
import { ensureAbsolute, ensureLeadingDot } from '../paths';

export abstract class DerivedComponent implements IFile, ISymbol {
  public readonly base: Component;

  constructor(base: Component) {
    this.base = base;
  }

  abstract get selector(): string;

  abstract get className(): string;

  abstract get fileName(): string;

  abstract get dir(): string;

  abstract get path(): string;

  public derivedPath(basePath: string): string {
    return relative(this.dir, ensureAbsolute(ensureLeadingDot(basePath), this.base.dir))
  };

  public get text(): string {
    return this.className;
  };

  get exists(): boolean {
    return this.base.tree.exists(this.path);
  }
}
