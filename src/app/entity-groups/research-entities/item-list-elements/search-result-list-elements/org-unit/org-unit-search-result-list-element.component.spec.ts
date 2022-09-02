import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../../core/shared/item.model';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { OrgUnitSearchResultListElementComponent } from './org-unit-search-result-list-element.component';

let orgUnitListElementComponent: OrgUnitSearchResultListElementComponent;
let fixture: ComponentFixture<OrgUnitSearchResultListElementComponent>;

const mockItemWithMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: observableOf({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title',
          },
        ],
        'dc.description': [
          {
            language: 'en_US',
            value: 'A description about the OrgUnit',
          },
        ],
      },
    }),
  }
);
const mockItemWithoutMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: observableOf({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title',
          },
        ],
      },
    }),
  }
);

describe('OrgUnitSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrgUnitSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: DSONameService, useClass: DSONameServiceMock },
      ],

      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(OrgUnitSearchResultListElementComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OrgUnitSearchResultListElementComponent);
    orgUnitListElementComponent = fixture.componentInstance;
  }));

  describe('When the item has an org unit description', () => {
    beforeEach(() => {
      orgUnitListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the description span', () => {
      const orgUnitDescriptionField = fixture.debugElement.query(
        By.css('span.item-list-org-unit-description')
      );
      expect(orgUnitDescriptionField).not.toBeNull();
    });
  });

  describe('When the item has no org unit description', () => {
    beforeEach(() => {
      orgUnitListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the description span', () => {
      const orgUnitDescriptionField = fixture.debugElement.query(
        By.css('span.item-list-org-unit-description')
      );
      expect(orgUnitDescriptionField).toBeNull();
    });
  });
});
