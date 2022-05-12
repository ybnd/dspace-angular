export interface IReplace {
  searchValue: string | RegExp;
  replaceValue: string;
}

export interface IFile {
  readonly path: string;
}

export interface ISymbol extends IFile {
  readonly text: string;
}

export interface IAlias extends ISymbol {
  readonly alias: string;
}
