import { enableProdMode } from '@angular/core';
/******************************************************************
 * Load `$localize` - not used for i18n in this project, we use ngx-translate.
 * It's used for localization of dates, numbers, currencies, etc.
 */
import '@angular/localize/init';
import 'core-js/es/reflect';
import 'reflect-metadata';
import 'zone.js';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { renderModule, renderModuleFactory } from '@angular/platform-server';
export { ngExpressEngine } from '@nguniversal/express-engine';
export { ServerAppModule } from './modules/app/server-app.module';
