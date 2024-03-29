[DSpace ESLint plugins](../../../README.md) > [HTML rules](../index.md) > `dspace-angular-html/themed-component-usages`
_______

Themeable components should be used via the selector of their `ThemedComponent` wrapper class

This ensures that custom themes can correctly override _all_ instances of this component.
The only exception to this rule are unit tests, where we may want to use the base component in order to keep the test setup simple.
      

_______

[Source code](../../../src/rules/html/themed-component-usages.ts)

### Examples


#### Valid code
    
        
```
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
```
    
        
```
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
```
    
        
Filename: `lint/test/fixture/src/test.spec.ts`
        
```
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
```
    
        
Filename: `lint/test/fixture/src/test.spec.ts`
        
```
@Component({
  template: '<ds-base-test-themeable></ds-base-test-themeable>'
})
class Test {
}
```
    



#### Invalid code
    

        
```
<ds-themed-test-themeable/>
<ds-themed-test-themeable></ds-themed-test-themeable>
<ds-themed-test-themeable [test]="something"></ds-themed-test-themeable>
```

    

        
```
<ds-base-test-themeable/>
<ds-base-test-themeable></ds-base-test-themeable>
<ds-base-test-themeable [test]="something"></ds-base-test-themeable>
```

    

