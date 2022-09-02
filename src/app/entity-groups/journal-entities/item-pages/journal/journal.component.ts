import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { VersionedItemComponent } from '../../../../item-page/simple/item-types/versioned-item/versioned-item.component';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent('Journal', ViewMode.StandalonePage)
@Component({
  selector: 'ds-journal',
  styleUrls: ['./journal.component.scss'],
  templateUrl: './journal.component.html',
})
/**
 * The component for displaying metadata and relations of an item of the type Journal
 */
export class JournalComponent extends VersionedItemComponent {}
