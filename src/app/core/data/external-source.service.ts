import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { hasValue, isNotEmptyOperator } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { ExternalSourceEntry } from '../shared/external-source-entry.model';
import { ExternalSource } from '../shared/external-source.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions } from './find-list-options.model';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

/**
 * A service handling all external source requests
 */
@Injectable()
export class ExternalSourceService extends DataService<ExternalSource> {
  protected linkPath = 'externalsources';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ExternalSource>
  ) {
    super();
  }

  /**
   * Get the endpoint to browse external sources
   * @param options
   * @param linkPath
   */
  getBrowseEndpoint(
    options: FindListOptions = {},
    linkPath: string = this.linkPath
  ): Observable<string> {
    return this.halService.getEndpoint(linkPath);
  }

  /**
   * Get the endpoint for an external source's entries
   * @param externalSourceId  The id of the external source to fetch entries for
   */
  getEntriesEndpoint(externalSourceId: string): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      map((href) => this.getIDHref(href, externalSourceId)),
      switchMap((href) => this.halService.getEndpoint('entries', href))
    );
  }

  /**
   * Get the entries for an external source
   * @param externalSourceId            The id of the external source to fetch entries for
   * @param searchOptions               The search options to limit results to
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  getExternalSourceEntries(
    externalSourceId: string,
    searchOptions?: PaginatedSearchOptions,
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow: FollowLinkConfig<ExternalSourceEntry>[]
  ): Observable<RemoteData<PaginatedList<ExternalSourceEntry>>> {
    const href$ = this.getEntriesEndpoint(externalSourceId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpoint: string) =>
        hasValue(searchOptions) ? searchOptions.toRestUrl(endpoint) : endpoint
      ),
      take(1)
    );

    // TODO create a dedicated ExternalSourceEntryDataService and move this entire method to it. Then the "as any"s won't be necessary
    return this.findAllByHref(
      href$,
      undefined,
      useCachedVersionIfAvailable,
      reRequestOnStale,
      ...(linksToFollow as any)
    ) as any;
  }
}
