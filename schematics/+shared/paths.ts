import { dirname, extname, relative, resolve } from 'path';
import { SchematicsException } from '@angular-devkit/schematics';
import { PathMustBeAbsoluteException } from '@angular-devkit/core';

const ALLOWED_TS_SPECIFIERS = [
  '',
  '.d',
  '.component',
  '.model',
  '.service',
  '.guard',
  '.decorator',
  '.actions',
  '.reducer',
  '.reducers',
  '.module',
  '.common',
  '.browser',
  '.server',
  '.prod',
  '.test',
  '.loader',
  '.resolver',
  '.template',
  '.interface',
  '.interfaces',
  '.type',
  '.types',
];

export function ensureNoExtension(path: string): string {
  const extension = extname(path);
  if (extension === '.ts') {
    return path.replace(/.ts$/, '');
  } else if (ALLOWED_TS_SPECIFIERS.includes(extension)) {
    return path;
  } else {
    throw new SchematicsException(`TypeScript file path should end with ".ts" (or any of the following: "${ALLOWED_TS_SPECIFIERS.join('", "')}"), this path ends in "${extension}"`);
  }
}

export function ensureAbsolute(path: string, fromDir?: string): string {
  if (!path.startsWith('.')) {  // todo: this is not 100%
    return path;
  } else {
    if (fromDir !== undefined) {
      return resolve(fromDir, path);
    } else {
      throw new PathMustBeAbsoluteException(
        'Import path must be absolute. When passing a relative path, also include an absolute path ' +
        'in the relativeTo argument in order to resolve it.'
      );
    }
  }
}
export function ensureLeadingDot(path: string): string {
  if (!path.startsWith('.')) {
    return `./${path}`;
  }
  return path;
}

export function backpedal(path: string, dir: string): string | null {
  let steps = 0;

  for (const level of path.split('/').reverse()) {
    if (level === dir) {
      return Array(steps).fill('..').join('/')
    } else {
      steps++;
    }
  }

  return null;
}

export function importPath(path: string, from: string): string {
  if (path.startsWith('@') || !path.startsWith('/')) {
    return path;
  }
  let relativePath = relative(dirname(from), path);
  relativePath = relativePath.replace(/\.ts$/, '');
  if (relativePath[0] !== '.') {
    relativePath = './' + relativePath;
  }
  return relativePath;
}

/**
 * @param path
 * @returns     The path relative to `src` (starts with a /)
 */
export function fromSrc(path: string): string {
  return path.replace(/^\/?src/, '');
}
