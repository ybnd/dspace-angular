import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { VersionHistory } from '../shared/version-history.model';
import { Version } from '../shared/version.model';
import { VERSION } from '../shared/version.resource-type';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { RequestService } from './request.service';

/**
 * Service responsible for handling requests related to the Version object
 */
@Injectable()
@dataService(VERSION)
export class VersionDataService extends DataService<Version> {
  protected linkPath = 'versions';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Version>
  ) {
    super();
  }

  /**
   * Get the version history for the given version
   * @param version
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   */
  getHistoryFromVersion(
    version: Version,
    useCachedVersionIfAvailable = false,
    reRequestOnStale = true
  ): Observable<VersionHistory> {
    return isNotEmpty(version)
      ? this.findById(
          version.id,
          useCachedVersionIfAvailable,
          reRequestOnStale,
          followLink('versionhistory')
        ).pipe(
          getFirstSucceededRemoteDataPayload(),
          switchMap((res: Version) => res.versionhistory),
          getFirstSucceededRemoteDataPayload()
        )
      : EMPTY;
  }

  /**
   * Get the ID of the version history for the given version
   * @param version
   */
  getHistoryIdFromVersion(version: Version): Observable<string> {
    return this.getHistoryFromVersion(version).pipe(
      map((versionHistory: VersionHistory) => versionHistory.id)
    );
  }
}
