import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { VersionedItemComponent } from '../../../../item-page/simple/item-types/versioned-item/versioned-item.component';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent('JournalVolume', ViewMode.StandalonePage)
@Component({
  selector: 'ds-journal-volume',
  styleUrls: ['./journal-volume.component.scss'],
  templateUrl: './journal-volume.component.html',
})
/**
 * The component for displaying metadata and relations of an item of the type Journal Volume
 */
export class JournalVolumeComponent extends VersionedItemComponent {}
