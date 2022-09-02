import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComcolModule } from '../../shared/comcol/comcol.module';
import { ResourcePoliciesModule } from '../../shared/resource-policies/resource-policies.module';
import { SharedModule } from '../../shared/shared.module';
import { CommunityFormModule } from '../community-form/community-form.module';
import { CommunityAuthorizationsComponent } from './community-authorizations/community-authorizations.component';
import { CommunityCurateComponent } from './community-curate/community-curate.component';
import { CommunityMetadataComponent } from './community-metadata/community-metadata.component';
import { CommunityRolesComponent } from './community-roles/community-roles.component';
import { EditCommunityPageComponent } from './edit-community-page.component';
import { EditCommunityPageRoutingModule } from './edit-community-page.routing.module';

/**
 * Module that contains all components related to the Edit Community page administrator functionality
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditCommunityPageRoutingModule,
    CommunityFormModule,
    ComcolModule,
    ResourcePoliciesModule,
  ],
  declarations: [
    EditCommunityPageComponent,
    CommunityCurateComponent,
    CommunityMetadataComponent,
    CommunityRolesComponent,
    CommunityAuthorizationsComponent,
  ],
})
export class EditCommunityPageModule {}
