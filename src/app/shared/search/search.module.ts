import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MissingTranslationHandler,
  TranslateModule,
} from '@ngx-translate/core';
import { NouisliderModule } from 'ng2-nouislider';

import { ConfigurationSearchPageComponent } from '../../search-page/configuration-search-page.component';
import { ThemedConfigurationSearchPageComponent } from '../../search-page/themed-configuration-search-page.component';
import { SharedModule } from '../shared.module';
import { MissingTranslationHelper } from '../translate/missing-translation.helper';
import { FacetConfigResponse } from './models/facet-config-response.model';
import { FacetValues } from './models/facet-values.model';
import { SearchObjects } from './models/search-objects.model';
import { SearchResult } from './models/search-result.model';
import { SearchComponent } from './search.component';
import { SearchAuthorityFilterComponent } from './search-filters/search-filter/search-authority-filter/search-authority-filter.component';
import { SearchBooleanFilterComponent } from './search-filters/search-filter/search-boolean-filter/search-boolean-filter.component';
import { SearchFacetFilterComponent } from './search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchFacetOptionComponent } from './search-filters/search-filter/search-facet-filter-options/search-facet-option/search-facet-option.component';
import { SearchFacetRangeOptionComponent } from './search-filters/search-filter/search-facet-filter-options/search-facet-range-option/search-facet-range-option.component';
import { SearchFacetSelectedOptionComponent } from './search-filters/search-filter/search-facet-filter-options/search-facet-selected-option/search-facet-selected-option.component';
import { SearchFacetFilterWrapperComponent } from './search-filters/search-filter/search-facet-filter-wrapper/search-facet-filter-wrapper.component';
import { SearchFilterComponent } from './search-filters/search-filter/search-filter.component';
import { SearchHierarchyFilterComponent } from './search-filters/search-filter/search-hierarchy-filter/search-hierarchy-filter.component';
import { SearchRangeFilterComponent } from './search-filters/search-filter/search-range-filter/search-range-filter.component';
import { SearchTextFilterComponent } from './search-filters/search-filter/search-text-filter/search-text-filter.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { ThemedSearchFiltersComponent } from './search-filters/themed-search-filters.component';
import { SearchLabelComponent } from './search-labels/search-label/search-label.component';
import { SearchLabelsComponent } from './search-labels/search-labels.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ThemedSearchResultsComponent } from './search-results/themed-search-results.component';
import { SearchSettingsComponent } from './search-settings/search-settings.component';
import { ThemedSearchSettingsComponent } from './search-settings/themed-search-settings.component';
import { SearchSidebarComponent } from './search-sidebar/search-sidebar.component';
import { ThemedSearchSidebarComponent } from './search-sidebar/themed-search-sidebar.component';
import { SearchSwitchConfigurationComponent } from './search-switch-configuration/search-switch-configuration.component';
import { ThemedSearchComponent } from './themed-search.component';

const COMPONENTS = [
  SearchComponent,
  ThemedSearchComponent,
  SearchResultsComponent,
  SearchSidebarComponent,
  SearchSettingsComponent,
  SearchFiltersComponent,
  SearchFilterComponent,
  SearchFacetFilterComponent,
  SearchLabelsComponent,
  SearchLabelComponent,
  SearchFacetFilterWrapperComponent,
  SearchRangeFilterComponent,
  SearchTextFilterComponent,
  SearchHierarchyFilterComponent,
  SearchBooleanFilterComponent,
  SearchFacetOptionComponent,
  SearchFacetSelectedOptionComponent,
  SearchFacetRangeOptionComponent,
  SearchAuthorityFilterComponent,
  SearchSwitchConfigurationComponent,
  ConfigurationSearchPageComponent,
  ThemedConfigurationSearchPageComponent,
  ThemedSearchResultsComponent,
  ThemedSearchSettingsComponent,
  ThemedSearchFiltersComponent,
  ThemedSearchSidebarComponent,
];

const ENTRY_COMPONENTS = [
  SearchFacetFilterComponent,
  SearchRangeFilterComponent,
  SearchTextFilterComponent,
  SearchHierarchyFilterComponent,
  SearchBooleanFilterComponent,
  SearchFacetOptionComponent,
  SearchFacetSelectedOptionComponent,
  SearchFacetRangeOptionComponent,
  SearchAuthorityFilterComponent,
];

/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const MODELS = [
  SearchObjects,
  FacetConfigResponse,
  FacetValues,
  SearchResult,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationHelper,
      },
      useDefaultLang: true,
    }),
    SharedModule.withEntryComponents(),
    NouisliderModule,
  ],
  exports: [...COMPONENTS],
})
export class SearchModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SearchModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
    };
  }
}
