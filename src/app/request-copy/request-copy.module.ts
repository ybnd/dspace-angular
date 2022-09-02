import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DenyRequestCopyComponent } from './deny-request-copy/deny-request-copy.component';
import { EmailRequestCopyComponent } from './email-request-copy/email-request-copy.component';
import { GrantDenyRequestCopyComponent } from './grant-deny-request-copy/grant-deny-request-copy.component';
import { GrantRequestCopyComponent } from './grant-request-copy/grant-request-copy.component';
import { RequestCopyRoutingModule } from './request-copy-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, RequestCopyRoutingModule],
  declarations: [
    GrantDenyRequestCopyComponent,
    DenyRequestCopyComponent,
    EmailRequestCopyComponent,
    GrantRequestCopyComponent,
  ],
  providers: [],
})

/**
 * Module related to components used to grant or deny an item request
 */
export class RequestCopyModule {}
