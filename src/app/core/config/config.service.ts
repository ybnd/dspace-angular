/* eslint-disable max-classes-per-file */
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { ConfigObject } from './models/config.model';

class DataServiceImpl extends DataService<ConfigObject> {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ConfigObject>,
    protected linkPath: string
  ) {
    super();
  }
}

export abstract class ConfigService {
  /**
   * A private DataService instance to delegate specific methods to.
   */
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ConfigObject>,
    protected linkPath: string
  ) {
    this.dataService = new DataServiceImpl(
      requestService,
      rdbService,
      null,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator,
      this.linkPath
    );
  }

  public findByHref(
    href: string,
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow: FollowLinkConfig<ConfigObject>[]
  ): Observable<RemoteData<ConfigObject>> {
    return this.dataService
      .findByHref(
        href,
        useCachedVersionIfAvailable,
        reRequestOnStale,
        ...linksToFollow
      )
      .pipe(
        getFirstCompletedRemoteData(),
        map((rd: RemoteData<ConfigObject>) => {
          if (rd.hasFailed) {
            throw new Error(`Couldn't retrieve the config`);
          } else {
            return rd;
          }
        })
      );
  }
}
