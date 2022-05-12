import { DerivedComponent } from './derived-component.model';

export class TestDerivedComponent extends DerivedComponent {
  public get className(): string {
    return 'TestDerived' + this.base.className;
  }

  public get dir(): string {
    return '/src/test/derived';
  }

  public get fileName(): string {
    return 'test-derived-' + this.base.fileName;
  }

  public get path(): string {
    return this.dir + '/' + this.fileName;
  }

  public get selector(): string {
    return 'test-derived-' + this.base.selector;
  }

}

describe('DerivedComponent', () => {
  xit('', () => {
    expect(false).toBe(true);
  });
});
