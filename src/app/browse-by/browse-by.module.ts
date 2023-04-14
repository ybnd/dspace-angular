import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseByTitlePageComponent } from './browse-by-title-page/browse-by-title-page.component';
import { SharedModule } from '../shared/shared.module';
import { BrowseByMetadataPageComponent } from './browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseByDatePageComponent } from './browse-by-date-page/browse-by-date-page.component';
import { BrowseBySwitcherComponent } from './browse-by-switcher/browse-by-switcher.component';
import { BrowseByTaxonomyPageComponent } from './browse-by-taxonomy-page/browse-by-taxonomy-page.component';
import { ThemedBrowseBySwitcherComponent } from './browse-by-switcher/themed-browse-by-switcher.component';
import { ComcolModule } from '../shared/comcol/comcol.module';
import { ThemedBrowseByMetadataPageComponent } from './browse-by-metadata-page/themed-browse-by-metadata-page.component';
import { ThemedBrowseByDatePageComponent } from './browse-by-date-page/themed-browse-by-date-page.component';
import { ThemedBrowseByTitlePageComponent } from './browse-by-title-page/themed-browse-by-title-page.component';
import { FormModule } from '../shared/form/form.module';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  BrowseByTitlePageComponent,
  BrowseByMetadataPageComponent,
  BrowseByDatePageComponent,

  ThemedBrowseByMetadataPageComponent,
  ThemedBrowseByDatePageComponent,
  ThemedBrowseByTitlePageComponent,

];

@NgModule({
  imports: [
    CommonModule,
    ComcolModule,
    SharedModule,
    FormModule,
  ],
  declarations: [
    BrowseBySwitcherComponent,
    ThemedBrowseBySwitcherComponent,
    BrowseByTaxonomyPageComponent,
    ...ENTRY_COMPONENTS
  ],
  exports: [
    BrowseBySwitcherComponent
  ]
})
export class BrowseByModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SharedModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
