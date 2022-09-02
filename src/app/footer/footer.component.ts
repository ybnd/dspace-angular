import { Component, Optional } from '@angular/core';
import { environment } from '../../environments/environment';
import { KlaroService } from '../shared/cookies/klaro.service';
import { hasValue } from '../shared/empty.util';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html',
})
export class FooterComponent {
  dateObj: number = Date.now();

  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter = false;
  showPrivacyPolicy = environment.info.enablePrivacyStatement;
  showEndUserAgreement = environment.info.enableEndUserAgreement;

  constructor(@Optional() private cookies: KlaroService) {}

  showCookieSettings() {
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
  }
}
