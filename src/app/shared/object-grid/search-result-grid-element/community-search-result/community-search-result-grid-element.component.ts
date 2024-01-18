import { Component, Input } from '@angular/core';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { Community } from '../../../../core/shared/community.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { hasNoValue, hasValue } from '../../../empty.util';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { followLink } from '../../../utils/follow-link-config.model';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';

@Component({
  selector: 'ds-community-search-result-grid-element',
  styleUrls: [
    '../search-result-grid-element.component.scss',
    'community-search-result-grid-element.component.scss',
  ],
  templateUrl: 'community-search-result-grid-element.component.html',
})
/**
 * Component representing a grid element for a community search result
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.GridElement)
export class CommunitySearchResultGridElementComponent extends SearchResultGridElementComponent<
  CommunitySearchResult,
  Community
> {
  private _dso: Community;

  constructor(
    public dsoNameService: DSONameService,
    private linkService: LinkService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService);
  }

  // @ts-ignore
  @Input() set dso(dso: Community) {
    this._dso = dso;
    if (hasValue(this._dso) && hasNoValue(this._dso.logo)) {
      this.linkService.resolveLink<Community>(this._dso, followLink('logo'));
    }
  }

  get dso(): Community {
    return this._dso;
  }
}
