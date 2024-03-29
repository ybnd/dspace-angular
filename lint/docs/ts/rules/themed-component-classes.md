[DSpace ESLint plugins](../../../README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/themed-component-classes`
_______

Formatting rules for themeable component classes

_______

[Source code](../../../src/rules/ts/themed-component-classes.ts)

### Examples


#### Valid code
    
        
```
@Component({
  selector: 'ds-something',
  standalone: true,
})
class Something {
}
```
    
        
```
@Component({
  selector: 'ds-base-test-themable',
  standalone: true,
})
class TestThemeableTomponent {
}
```
    
        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    TestThemeableComponent,
  ],
})
class ThemedTestThemeableTomponent extends ThemedComponent<TestThemeableComponent> {
}
```
    
        
Filename: `lint/test/fixture/src/themes/test/app/test/test-themeable.component.ts`
        
```
@Component({
  selector: 'ds-themed-test-themable',
  standalone: true,
})
class Override extends BaseComponent {
}
```
    



#### Invalid code
    

        
```
@Component({
  selector: 'ds-base-test-themable',
})
class TestThemeableComponent {
}
```

    

        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```
@Component({
  selector: 'ds-test-themable',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```

    

        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```

    

        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```
import { SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    SomethingElse,
  ],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```

    

        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```
import { Something, SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    SomethingElse,
  ],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```

    

        
Filename: `lint/test/fixture/src/themes/test/app/test/test-themeable.component.ts`
        
```
@Component({
  selector: 'ds-themed-test-themable',
})
class Override extends BaseComponent {
}
```

    

