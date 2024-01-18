import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';
import { UploadModule } from '../shared/upload/upload.module';
import { CollectionSelectorComponent } from './collection-selector/collection-selector.component';
import { MyDSpaceGuard } from './my-dspace.guard';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { MyDSpaceNewExternalDropdownComponent } from './my-dspace-new-submission/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';
import { MyDSpaceNewSubmissionDropdownComponent } from './my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { MyDspacePageRoutingModule } from './my-dspace-page-routing.module';
import { MyDspaceSearchModule } from './my-dspace-search.module';
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
    UploadModule,
  ],
  declarations: DECLARATIONS,
  providers: [MyDSpaceGuard, MyDSpaceConfigurationService],
  exports: DECLARATIONS,
})

/**
 * This module handles all components that are necessary for the mydspace page
 */
export class MyDSpacePageModule {}
