import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { VersionedItemComponent } from '../../../../item-page/simple/item-types/versioned-item/versioned-item.component';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent('JournalIssue', ViewMode.StandalonePage)
@Component({
  selector: 'ds-journal-issue',
  styleUrls: ['./journal-issue.component.scss'],
  templateUrl: './journal-issue.component.html',
})
/**
 * The component for displaying metadata and relations of an item of the type Journal Issue
 */
export class JournalIssueComponent extends VersionedItemComponent {}
