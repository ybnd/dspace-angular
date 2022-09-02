import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { WorkflowAction } from '../tasks/models/workflow-action-object.model';
import { WORKFLOW_ACTION } from '../tasks/models/workflow-action-object.resource-type';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions } from './find-list-options.model';
import { RequestService } from './request.service';

/**
 * A service responsible for fetching/sending data from/to the REST API on the workflowactions endpoint
 */
@Injectable()
@dataService(WORKFLOW_ACTION)
export class WorkflowActionDataService extends DataService<WorkflowAction> {
  protected linkPath = 'workflowactions';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<WorkflowAction>
  ) {
    super();
  }

  getBrowseEndpoint(
    options: FindListOptions,
    linkPath?: string
  ): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
}
