import { Component } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { getItemPageRoute } from '../../../../../item-page/item-page-routing-paths';
import { focusShadow } from '../../../../animations/focus';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultGridElementComponent } from '../../search-result-grid-element.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.GridElement)
@listableObjectComponent(ItemSearchResult, ViewMode.GridElement)
@Component({
  selector: 'ds-item-search-result-grid-element',
  styleUrls: ['./item-search-result-grid-element.component.scss'],
  templateUrl: './item-search-result-grid-element.component.html',
  animations: [focusShadow],
})
/**
 * The component for displaying a grid element for an item search result of the type Publication
 */
export class ItemSearchResultGridElementComponent extends SearchResultGridElementComponent<
  ItemSearchResult,
  Item
> {
  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
  }
}
