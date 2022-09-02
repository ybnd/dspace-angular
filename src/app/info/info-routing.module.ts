import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { FeedbackGuard } from '../core/feedback/feedback.guard';
import { ThemedEndUserAgreementComponent } from './end-user-agreement/themed-end-user-agreement.component';
import { ThemedFeedbackComponent } from './feedback/themed-feedback.component';
import {
  END_USER_AGREEMENT_PATH,
  FEEDBACK_PATH,
  PRIVACY_PATH,
} from './info-routing-paths';
import { ThemedPrivacyComponent } from './privacy/themed-privacy.component';

const imports = [
  RouterModule.forChild([
    {
      path: FEEDBACK_PATH,
      component: ThemedFeedbackComponent,
      resolve: { breadcrumb: I18nBreadcrumbResolver },
      data: { title: 'info.feedback.title', breadcrumbKey: 'info.feedback' },
      canActivate: [FeedbackGuard],
    },
  ]),
];

if (environment.info.enableEndUserAgreement) {
  imports.push(
    RouterModule.forChild([
      {
        path: END_USER_AGREEMENT_PATH,
        component: ThemedEndUserAgreementComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {
          title: 'info.end-user-agreement.title',
          breadcrumbKey: 'info.end-user-agreement',
        },
      },
    ])
  );
}
if (environment.info.enablePrivacyStatement) {
  imports.push(
    RouterModule.forChild([
      {
        path: PRIVACY_PATH,
        component: ThemedPrivacyComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'info.privacy.title', breadcrumbKey: 'info.privacy' },
      },
    ])
  );
}

@NgModule({
  imports: [...imports],
})
/**
 * Module for navigating to components within the info module
 */
export class InfoRoutingModule {}
