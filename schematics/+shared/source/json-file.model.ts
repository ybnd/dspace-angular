import { SourceFile } from './file.model';

export class JsonFile extends SourceFile {
  private get obj(): object {
    return JSON.parse(this.content);
  }

  public modify(callback: (obj: object) => object): void {
    let obj = callback(this.obj);
    this.overwrite(JSON.stringify(obj, undefined, 2));  // todo: may mess up some file formatting
  }
}
