import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../shared/operators';
import { UsageReport } from './models/usage-report.model';
import { USAGE_REPORT } from './models/usage-report.resource-type';

/**
 * A service to retrieve {@link UsageReport}s from the REST API
 */
@Injectable()
@dataService(USAGE_REPORT)
export class UsageReportService extends DataService<UsageReport> {
  protected linkPath = 'usagereports';

  constructor(
    protected comparator: DefaultChangeAnalyzer<UsageReport>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected objectCache: ObjectCacheService,
    protected rdbService: RemoteDataBuildService,
    protected requestService: RequestService,
    protected store: Store<CoreState>
  ) {
    super();
  }

  getStatistic(scope: string, type: string): Observable<UsageReport> {
    return this.findById(`${scope}_${type}`).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload()
    );
  }

  searchStatistics(
    uri: string,
    page: number,
    size: number
  ): Observable<UsageReport[]> {
    return this.searchBy(
      'object',
      {
        searchParams: [
          {
            fieldName: `uri`,
            fieldValue: uri,
          },
        ],
        currentPage: page,
        elementsPerPage: size,
      },
      true,
      false
    ).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((list) => list.page)
    );
  }
}
