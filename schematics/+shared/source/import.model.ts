import { ISymbol } from '../interfaces';
import { TypescriptFile } from './typescript-file.model';
import { ensureAbsolute, ensureNoExtension } from '../paths';

export class Import implements ISymbol {
  public readonly path: string;
  public readonly text: string;

  constructor(symbol: ISymbol, fromFile?: TypescriptFile) {
    this.path = ensureNoExtension(ensureAbsolute(symbol.path, fromFile?.dir));
    this.text = symbol.text;
  }
}
