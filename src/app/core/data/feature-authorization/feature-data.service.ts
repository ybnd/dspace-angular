import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { dataService } from '../../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { CoreState } from '../../core-state.model';
import { Feature } from '../../shared/feature.model';
import { FEATURE } from '../../shared/feature.resource-type';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { DataService } from '../data.service';
import { DSOChangeAnalyzer } from '../dso-change-analyzer.service';
import { RequestService } from '../request.service';

/**
 * A service to retrieve {@link Feature}s from the REST API
 */
@Injectable()
@dataService(FEATURE)
export class FeatureDataService extends DataService<Feature> {
  protected linkPath = 'features';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Feature>
  ) {
    super();
  }
}
