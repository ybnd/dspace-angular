import { AutoSyncConfig } from './auto-sync-config.interface';
import { Config } from './config.interface';

export interface CacheConfig extends Config {
  msToLive: {
    default: number;
  };
  control: string;
  autoSync: AutoSyncConfig;
}
