[DSpace ESLint plugins](../../../README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/themed-component-usages`
_______

Themeable components should be used via their `ThemedComponent` wrapper class

This ensures that custom themes can correctly override _all_ instances of this component.
There are a few exceptions where the base class can still be used:
- Class declaration expressions (otherwise we can't declare, extend or override the class in the first place)
- Angular modules (except for routing modules)
- Angular `@ViewChild` decorators
- Type annotations
      

_______

[Source code](../../../src/rules/ts/themed-component-usages.ts)

### Examples


#### Valid code
    
        
```
import { ThemedTestThemeableComponent } from './app/test/themed-test-themeable.component';

const config = {
  a: ThemedTestThemeableComponent,
  b: ChipsComponent,
}
```
    
        
```
export class TestThemeableComponent {
}
```
    
        
```
import { TestThemeableComponent } from './app/test/test-themeable.component';

export class ThemedAdminSidebarComponent extends ThemedComponent<TestThemeableComponent> {
}
```
    
        
```
import { TestThemeableComponent } from './app/test/test-themeable.component';

export class Something {
  @ViewChild(TestThemeableComponent) test: TestThemeableComponent;
}
```
    
        
Filename: `lint/test/fixture/src/app/test/test.component.spec.ts`
        
```
By.css('ds-themeable');
By.Css('#test > ds-themeable > #nest');
```
    
        
Filename: `lint/test/fixture/src/app/test/test.component.cy.ts`
        
```
By.css('ds-themeable');
By.Css('#test > ds-themeable > #nest');
```
    



#### Invalid code
    

        
```
import { TestThemeableComponent } from './app/test/test-themeable.component';
import { TestComponent } from './app/test/test.component';

const config = {
  a: TestThemeableComponent,
  b: TestComponent,
}
```

    

        
```
import { Something, TestThemeableComponent } from './app/test/test-themeable.component';
import { TestComponent } from './app/test/test.component';

const config = {
  a: TestThemeableComponent,
  b: TestComponent,
  c: Something,
}
```

    

        
```
const DECLARATIONS = [
  Something,
  TestThemeableComponent,
  Something,
  ThemedTestThemeableComponent,
];
```

    

        
Filename: `lint/test/fixture/src/app/test/test.component.spec.ts`
        
```
By.css('ds-themed-themeable');
By.css('#test > ds-themed-themeable > #nest');
```

    

        
Filename: `lint/test/fixture/src/app/test/test.component.spec.ts`
        
```
By.css('ds-base-themeable');
By.css('#test > ds-base-themeable > #nest');
```

    

        
Filename: `lint/test/fixture/src/app/test/test.component.cy.ts`
        
```
cy.get('ds-themed-themeable');
cy.get('#test > ds-themed-themeable > #nest');
```

    

        
Filename: `lint/test/fixture/src/app/test/test.component.cy.ts`
        
```
cy.get('ds-base-themeable');
cy.get('#test > ds-base-themeable > #nest');
```

    

        
Filename: `lint/test/fixture/src/themes/test/app/test/other-themeable.component.ts`
        
```
import { Component } from '@angular/core';

import { Context } from './app/core/shared/context.model';
import { TestThemeableComponent } from '../../../../app/test/test-themeable.component';

@Component({
  standalone: true,
  imports: [TestThemeableComponent],
})
export class UsageComponent {
}
```

    

        
Filename: `lint/test/fixture/src/themes/test/app/test/other-themeable.component.ts`
        
```
import { Component } from '@angular/core';

import { Context } from './app/core/shared/context.model';
import { TestThemeableComponent } from '../../../../app/test/test-themeable.component';
import { ThemedTestThemeableComponent } from '../../../../app/test/themed-test-themeable.component';

@Component({
  standalone: true,
  imports: [TestThemeableComponent, ThemedTestThemeableComponent],
})
export class UsageComponent {
}
```

    

