import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';
import { CollectionSelectorComponent } from './collection-selector/collection-selector.component';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { MyDSpaceNewExternalDropdownComponent } from './my-dspace-new-submission/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component';
import { MyDSpaceNewSubmissionDropdownComponent } from './my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';
import { MyDspacePageRoutingModule } from './my-dspace-page-routing.module';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { MyDspaceSearchModule } from './my-dspace-search.module';
import { MyDSpaceGuard } from './my-dspace.guard';
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';

const DECLARATIONS = [
  MyDSpacePageComponent,
  ThemedMyDSpacePageComponent,
  MyDSpaceNewSubmissionComponent,
  CollectionSelectorComponent,
  MyDSpaceNewSubmissionDropdownComponent,
  MyDSpaceNewExternalDropdownComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SearchModule,
    MyDspacePageRoutingModule,
    MyDspaceSearchModule.withEntryComponents(),
  ],
  declarations: DECLARATIONS,
  providers: [MyDSpaceGuard, MyDSpaceConfigurationService],
  exports: DECLARATIONS,
})

/**
 * This module handles all components that are necessary for the mydspace page
 */
export class MyDSpacePageModule {}
