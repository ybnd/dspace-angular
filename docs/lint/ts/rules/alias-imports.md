[DSpace ESLint plugins](../../../../lint/README.md) > [TypeScript rules](../index.md) > `dspace-angular-ts/alias-imports`
_______

Unclear imports should be aliased for clarity

_______

[Source code](../../../../lint/src/rules/ts/alias-imports.ts)

### Examples


#### Valid code
    
##### correctly aliased imports
        
```typescript
import { of as observableOf } from 'rxjs';
```
    



#### Invalid code  &amp; automatic fixes
    
##### imports without alias
        
```typescript
import { of } from 'rxjs';
const thing$ = of('thing');
```
Will produce the following error(s):
```
This import must be aliased to {{ local }}
This import must be aliased to {{ local }}
```
        
Result of `yarn lint --fix`:
```typescript
import { of as observableOf } from 'rxjs';
const thing$ = observableOf('thing');
```
        
    
##### imports with and without alias
        
```typescript
import { of, of as observableOf } from 'rxjs';
const thing1$ = of('thing1');
const thing2$ = observableOf('thing2');
```
Will produce the following error(s):
```
This import must be aliased to {{ local }}
This import must be aliased to {{ local }}
```
        
Result of `yarn lint --fix`:
```typescript
import { of as observableOf } from 'rxjs';
const thing1$ = observableOf('thing1');
const thing2$ = observableOf('thing2');
```
        
    
##### imports under the wrong alias
        
```typescript
import { of as ofSomething } from 'rxjs';
const thing$ = ofSomething('thing');
```
Will produce the following error(s):
```
This import uses the wrong alias (should be {{ local }})
This import uses the wrong alias (should be {{ local }})
```
        
Result of `yarn lint --fix`:
```typescript
import { of as observableOf } from 'rxjs';
const thing$ = observableOf('thing');
```
        
    

