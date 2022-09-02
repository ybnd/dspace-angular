import { Component } from '@angular/core';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { LogInExternalProviderComponent } from '../log-in-external-provider.component';
import { renderAuthMethodFor } from '../log-in.methods-decorator';

@Component({
  selector: 'ds-log-in-shibboleth',
  templateUrl: './log-in-shibboleth.component.html',
  styleUrls: ['./log-in-shibboleth.component.scss'],
})
@renderAuthMethodFor(AuthMethodType.Shibboleth)
export class LogInShibbolethComponent extends LogInExternalProviderComponent {
  /**
   * Redirect to shibboleth authentication url
   */
  redirectToShibboleth() {
    this.redirectToExternalProvider();
  }
}
