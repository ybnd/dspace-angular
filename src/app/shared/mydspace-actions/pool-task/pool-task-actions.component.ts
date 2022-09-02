import { Component, Injector, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { SearchService } from '../../../core/shared/search/search.service';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { PoolTaskDataService } from '../../../core/tasks/pool-task-data.service';
import { getWorkflowItemViewRoute } from '../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';
import { isNotUndefined } from '../../empty.util';
import { NotificationsService } from '../../notifications/notifications.service';
import { MyDSpaceReloadableActionsComponent } from '../mydspace-reloadable-actions';

/**
 * This component represents mydspace actions related to PoolTask object.
 */
@Component({
  selector: 'ds-pool-task-actions',
  styleUrls: ['./pool-task-actions.component.scss'],
  templateUrl: './pool-task-actions.component.html',
})
export class PoolTaskActionsComponent
  extends MyDSpaceReloadableActionsComponent<PoolTask, PoolTaskDataService>
  implements OnDestroy
{
  /**
   * The PoolTask object
   */
  @Input() object: PoolTask;

  /**
   * The workflowitem object that belonging to the PoolTask object
   */
  public workflowitem$: Observable<WorkflowItem>;

  /**
   * Anchor used to reload the pool task.
   */
  public itemUuid: string;

  subs = [];

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {Router} router
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   * @param {SearchService} searchService
   * @param {RequestService} requestService
   */
  constructor(
    protected injector: Injector,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected claimedTaskService: ClaimedTaskDataService,
    protected translate: TranslateService,
    protected searchService: SearchService,
    protected requestService: RequestService
  ) {
    super(
      PoolTask.type,
      injector,
      router,
      notificationsService,
      translate,
      searchService,
      requestService
    );
  }

  /**
   * Claim the task.
   */
  claim() {
    this.subs.push(this.startActionExecution().pipe(take(1)).subscribe());
  }

  /**
   * Init the PoolTask and WorkflowItem objects
   *
   * @param {PoolTask} object
   */
  initObjects(object: PoolTask) {
    this.object = object;
    this.workflowitem$ = (
      this.object.workflowitem as Observable<RemoteData<WorkflowItem>>
    ).pipe(
      filter(
        (rd: RemoteData<WorkflowItem>) =>
          !rd.isRequestPending && isNotUndefined(rd.payload)
      ),
      map((rd: RemoteData<WorkflowItem>) => rd.payload),
      take(1)
    );
  }

  actionExecution(): Observable<ProcessTaskResponse> {
    return this.objectDataService.getPoolTaskEndpointById(this.object.id).pipe(
      switchMap((poolTaskHref) => {
        return this.claimedTaskService.claimTask(this.object.id, poolTaskHref);
      })
    );
  }

  reloadObjectExecution(): Observable<RemoteData<DSpaceObject> | DSpaceObject> {
    return this.claimedTaskService.findByItem(this.itemUuid).pipe(take(1));
  }

  /**
   * Retrieve the itemUuid.
   */
  initReloadAnchor() {
    (this.object as any).workflowitem
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        switchMap((workflowItem: WorkflowItem) =>
          workflowItem.item.pipe(getFirstSucceededRemoteDataPayload())
        )
      )
      .subscribe((item: Item) => {
        this.itemUuid = item.uuid;
      });
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Get the workflowitem view route.
   */
  getWorkflowItemViewRoute(workflowitem: WorkflowItem): string {
    return getWorkflowItemViewRoute(workflowitem?.id);
  }
}
