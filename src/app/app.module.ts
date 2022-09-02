import { APP_BASE_HREF, CommonModule, DOCUMENT } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicErrorMessagesMatcher,
  DYNAMIC_ERROR_MESSAGES_MATCHER,
  DYNAMIC_MATCHER_PROVIDERS,
} from '@ng-dynamic-forms/core';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import {
  MetaReducer,
  Store,
  StoreModule,
  USER_PROVIDED_META_REDUCERS,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgxMaskModule } from 'ngx-mask';
import { AppConfig, APP_CONFIG } from '../config/app-config.interface';
import { StoreDevModules } from '../config/store/devtools';
import { environment } from '../environments/environment';
import { EagerThemesModule } from '../themes/eager-themes.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appEffects } from './app.effects';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';
import { appReducers, AppState, storeModuleConfig } from './app.reducer';
import { CheckAuthenticationTokenAction } from './core/auth/auth.actions';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { CoreModule } from './core/core.module';
import { LocaleInterceptor } from './core/locale/locale.interceptor';
import { LogInterceptor } from './core/log/log.interceptor';
import { ClientCookieService } from './core/services/client-cookie.service';
import { XsrfInterceptor } from './core/xsrf/xsrf.interceptor';
import { NavbarModule } from './navbar/navbar.module';
import { RootModule } from './root.module';
import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';
import { SharedModule } from './shared/shared.module';

export function getConfig() {
  return environment;
}

const getBaseHref = (document: Document, appConfig: AppConfig): string => {
  const baseTag = document.querySelector('head > base');
  baseTag.setAttribute(
    'href',
    `${appConfig.ui.nameSpace}${
      appConfig.ui.nameSpace.endsWith('/') ? '' : '/'
    }`
  );
  return baseTag.getAttribute('href');
};

export function getMetaReducers(appConfig: AppConfig): MetaReducer<AppState>[] {
  return appConfig.debug
    ? [...appMetaReducers, ...debugMetaReducers]
    : appMetaReducers;
}

/**
 * Condition for displaying error messages on email form field
 */
export const ValidateEmailErrorStateMatcher: DynamicErrorMessagesMatcher = (
  control: AbstractControl,
  model: any,
  hasFocus: boolean
) => {
  return (
    (control.touched && !hasFocus) || (control.errors?.emailTaken && hasFocus)
  );
};

const IMPORTS = [
  CommonModule,
  SharedModule,
  NavbarModule,
  HttpClientModule,
  AppRoutingModule,
  CoreModule.forRoot(),
  ScrollToModule.forRoot(),
  NgbModule,
  TranslateModule.forRoot(),
  NgxMaskModule.forRoot(),
  EffectsModule.forRoot(appEffects),
  StoreModule.forRoot(appReducers, storeModuleConfig),
  StoreRouterConnectingModule.forRoot(),
  StoreDevModules,
  EagerThemesModule,
  RootModule,
];

const PROVIDERS = [
  {
    provide: APP_CONFIG,
    useFactory: getConfig,
  },
  {
    provide: APP_BASE_HREF,
    useFactory: getBaseHref,
    deps: [DOCUMENT, APP_CONFIG],
  },
  {
    provide: USER_PROVIDED_META_REDUCERS,
    useFactory: getMetaReducers,
    deps: [APP_CONFIG],
  },
  {
    provide: RouterStateSerializer,
    useClass: DSpaceRouterStateSerializer,
  },
  ClientCookieService,
  // Check the authentication token when the app initializes
  {
    provide: APP_INITIALIZER,
    useFactory: (store: Store<AppState>) => {
      return () => store.dispatch(new CheckAuthenticationTokenAction());
    },
    deps: [Store],
    multi: true,
  },
  // register AuthInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  // register LocaleInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LocaleInterceptor,
    multi: true,
  },
  // register XsrfInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: XsrfInterceptor,
    multi: true,
  },
  // register LogInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LogInterceptor,
    multi: true,
  },
  {
    provide: DYNAMIC_ERROR_MESSAGES_MATCHER,
    useValue: ValidateEmailErrorStateMatcher,
  },
  ...DYNAMIC_MATCHER_PROVIDERS,
];

const DECLARATIONS = [AppComponent];

const EXPORTS = [];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'dspace-angular' }),
    ...IMPORTS,
  ],
  providers: [...PROVIDERS],
  declarations: [...DECLARATIONS],
  exports: [...EXPORTS, ...DECLARATIONS],
})
export class AppModule {}
