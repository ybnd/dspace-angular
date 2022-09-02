import { InjectionToken } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { ActuatorsConfig } from './actuators.config';
import { AuthConfig } from './auth-config.interfaces';
import { BrowseByConfig } from './browse-by-config.interface';
import { BundleConfig } from './bundle-config.interface';
import { CacheConfig } from './cache-config.interface';
import { CollectionPageConfig } from './collection-page-config.interface';
import { Config } from './config.interface';
import { FormConfig } from './form-config.interfaces';
import { InfoConfig } from './info-config.interface';
import { ItemConfig } from './item-config.interface';
import { LangConfig } from './lang-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { ServerConfig } from './server-config.interface';
import { SubmissionConfig } from './submission-config.interface';
import { ThemeConfig } from './theme.model';
import { UIServerConfig } from './ui-server-config.interface';

interface AppConfig extends Config {
  ui: UIServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  auth?: AuthConfig;
  form: FormConfig;
  notifications: INotificationBoardOptions;
  submission: SubmissionConfig;
  debug: boolean;
  defaultLanguage: string;
  languages: LangConfig[];
  browseBy: BrowseByConfig;
  item: ItemConfig;
  collection: CollectionPageConfig;
  themes: ThemeConfig[];
  mediaViewer: MediaViewerConfig;
  bundle: BundleConfig;
  actuators: ActuatorsConfig;
  info: InfoConfig;
}

const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

const APP_CONFIG_STATE = makeStateKey('APP_CONFIG_STATE');

export { AppConfig, APP_CONFIG, APP_CONFIG_STATE };
