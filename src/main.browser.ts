import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'core-js/es/reflect';
import 'reflect-metadata';
import { load as loadWebFont } from 'webfontloader';
import 'zone.js';
import { hasValue } from './app/shared/empty.util';
import { AppConfig } from './config/app-config.interface';
import { extendEnvironmentWithAppConfig } from './config/config.util';
import { environment } from './environments/environment';
import { BrowserAppModule } from './modules/app/browser-app.module';

const bootstrap = () =>
  platformBrowserDynamic().bootstrapModule(BrowserAppModule, {});

const main = () => {
  // Load fonts async
  // https://github.com/typekit/webfontloader#configuration
  loadWebFont({
    google: {
      families: ['Droid Sans'],
    },
  });

  if (environment.production) {
    enableProdMode();
  }

  if (hasValue(environment.universal) && environment.universal.preboot) {
    return bootstrap();
  } else {
    return fetch('assets/config.json')
      .then((response) => response.json())
      .then((appConfig: AppConfig) => {
        // extend environment with app config for browser when not prerendered
        extendEnvironmentWithAppConfig(environment, appConfig);

        return bootstrap();
      });
  }
};

// support async tag or hmr
if (
  document.readyState === 'complete' &&
  hasValue(environment.universal) &&
  !environment.universal.preboot
) {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
