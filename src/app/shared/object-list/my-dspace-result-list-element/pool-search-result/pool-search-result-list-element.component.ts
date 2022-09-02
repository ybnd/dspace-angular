import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { PoolTaskSearchResult } from '../../../object-collection/shared/pool-task-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { followLink } from '../../../utils/follow-link-config.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';

/**
 * This component renders pool task object for the search result in the list view.
 */
@Component({
  selector: 'ds-pool-search-result-list-element',
  styleUrls: [
    '../../search-result-list-element/search-result-list-element.component.scss',
  ],
  templateUrl: './pool-search-result-list-element.component.html',
})
@listableObjectComponent(PoolTaskSearchResult, ViewMode.ListElement)
export class PoolSearchResultListElementComponent
  extends SearchResultListElementComponent<PoolTaskSearchResult, PoolTask>
  implements OnInit
{
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

  /**
   * The index of this list element
   */
  public index: number;

  constructor(
    protected linkService: LinkService,
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService
  ) {
    super(truncatableService, dsoNameService);
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
        followLink('item'),
        followLink('submitter')
      ),
      followLink('action')
    );
    this.workflowitemRD$ = this.dso.workflowitem as Observable<
      RemoteData<WorkflowItem>
    >;
  }
}
