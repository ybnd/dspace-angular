import { DataService } from './data.service';
import { WorkflowStep } from '../tasks/models/workflow-step.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { Injectable } from '@angular/core';
import { WORKFLOW_STEP } from '../tasks/models/workflow-step.resource-type';
import { dataService } from '../cache/builders/build-decorators';
import { Observable } from 'rxjs';
import { FindListOptions } from './request.models';

/* tslint:disable:max-classes-per-file */
@Injectable()
@dataService(WORKFLOW_STEP)
export class WorkflowStepDataService extends DataService<WorkflowStep> {
  protected linkPath = 'workflowsteps';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<WorkflowStep>) {
    super();
  }

  getBrowseEndpoint(options: FindListOptions, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
}
