[DSpace ESLint plugins](../../../README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/themed-component-selectors`
_______

Themeable component selectors should follow the DSpace convention

Each themeable component is comprised of a base component, a wrapper component and any number of themed components
- Base components should have a selector starting with `ds-base-`
- Themed components should have a selector starting with `ds-themed-`
- Wrapper components should have a selector starting with `ds-`, but not `ds-base-` or `ds-themed-`
  - This is the regular DSpace selector prefix
  - **When making a regular component themeable, its selector prefix should be changed to `ds-base-`, and the new wrapper's component should reuse the previous selector**

Unit tests are exempt from this rule, because they may redefine components using the same class name as other themeable components elsewhere in the source.
      

_______

[Source code](../../../src/rules/ts/themed-component-selectors.ts)

### Examples


#### Valid code
    
        
```
@Component({
  selector: 'ds-something',
})
class Something {
}
```
    
        
```
@Component({
  selector: 'ds-base-something',
})
class Something {
}

@Component({
  selector: 'ds-something',
})
class ThemedSomething extends ThemedComponent<Something> {
}

@Component({
  selector: 'ds-themed-something',
})
class OverrideSomething extends Something {
}
```
    
        
```
@Component({
  selector: 'ds-something',
})
class Something {
}

@Component({
  selector: 'ds-something-else',
})
class ThemedSomethingElse extends ThemedComponent<SomethingElse> {
}
```
    



#### Invalid code
    

        
Filename: `lint/test/fixture/src/app/test/test-themeable.component.ts`
        
```
@Component({
  selector: 'ds-something',
})
class TestThemeableComponent {
}
```

    

        
Filename: `lint/test/fixture/src/app/test/themed-test-themeable.component.ts`
        
```
@Component({
  selector: 'ds-themed-something',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
```

    

        
Filename: `lint/test/fixture/src/themes/test/app/test/test-themeable.component.ts`
        
```
@Component({
  selector: 'ds-something',
})
class TestThememeableComponent extends BaseComponent {
}
```

    

