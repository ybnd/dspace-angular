import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DYNAMIC_FORM_CONTROL_MAP_FN } from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import { dsDynamicFormControlMapFn } from '../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-control-container.component';
import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';
import { RelatedEntitiesSearchComponent } from './simple/related-entities/related-entities-search/related-entities-search.component';
import { TabbedRelatedEntitiesSearchComponent } from './simple/related-entities/tabbed-related-entities-search/tabbed-related-entities-search.component';

const COMPONENTS = [
  RelatedEntitiesSearchComponent,
  TabbedRelatedEntitiesSearchComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, SearchModule, SharedModule, TranslateModule],
  exports: [...COMPONENTS],
  providers: [
    {
      provide: DYNAMIC_FORM_CONTROL_MAP_FN,
      useValue: dsDynamicFormControlMapFn,
    },
  ],
})
export class ItemSharedModule {}
