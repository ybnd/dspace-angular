import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeedbackGuard } from '../core/feedback/feedback.guard';
import { SharedModule } from '../shared/shared.module';
import { EndUserAgreementContentComponent } from './end-user-agreement/end-user-agreement-content/end-user-agreement-content.component';
import { EndUserAgreementComponent } from './end-user-agreement/end-user-agreement.component';
import { ThemedEndUserAgreementComponent } from './end-user-agreement/themed-end-user-agreement.component';
import { FeedbackFormComponent } from './feedback/feedback-form/feedback-form.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ThemedFeedbackComponent } from './feedback/themed-feedback.component';
import { InfoRoutingModule } from './info-routing.module';
import { PrivacyContentComponent } from './privacy/privacy-content/privacy-content.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ThemedPrivacyComponent } from './privacy/themed-privacy.component';

const DECLARATIONS = [
  EndUserAgreementComponent,
  ThemedEndUserAgreementComponent,
  EndUserAgreementContentComponent,
  PrivacyComponent,
  PrivacyContentComponent,
  ThemedPrivacyComponent,
  FeedbackComponent,
  FeedbackFormComponent,
  ThemedFeedbackComponent,
];

@NgModule({
  imports: [CommonModule, SharedModule, InfoRoutingModule],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
  providers: [FeedbackGuard],
})
export class InfoModule {}
