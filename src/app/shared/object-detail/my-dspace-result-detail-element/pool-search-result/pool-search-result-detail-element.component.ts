import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { PoolTaskSearchResult } from '../../../object-collection/shared/pool-task-search-result.model';
import { followLink } from '../../../utils/follow-link-config.model';
import { SearchResultDetailElementComponent } from '../search-result-detail-element.component';

/**
 * This component renders pool task object for the search result in the detail view.
 */
@Component({
  selector: 'ds-pool-search-result-detail-element',
  styleUrls: ['../search-result-detail-element.component.scss'],
  templateUrl: './pool-search-result-detail-element.component.html',
})
@listableObjectComponent(PoolTaskSearchResult, ViewMode.DetailedListElement)
export class PoolSearchResultDetailElementComponent extends SearchResultDetailElementComponent<
  PoolTaskSearchResult,
  PoolTask
> {
  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.WAITING_CONTROLLER;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitemRD$: Observable<RemoteData<WorkflowItem>>;

  constructor(protected linkService: LinkService) {
    super();
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLinks(
      this.dso,
      followLink(
        'workflowitem',
        {},
        followLink('item', {}, followLink('bundles')),
        followLink('submitter')
      ),
      followLink('action')
    );
    this.workflowitemRD$ = this.dso.workflowitem as Observable<
      RemoteData<WorkflowItem>
    >;
  }
}
