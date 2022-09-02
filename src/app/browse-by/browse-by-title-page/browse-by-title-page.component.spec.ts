import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { BrowseService } from '../../core/browse/browse.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Community } from '../../core/shared/community.model';
import { Item } from '../../core/shared/item.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { toRemoteData } from '../browse-by-metadata-page/browse-by-metadata-page.component.spec';
import { BrowseByTitlePageComponent } from './browse-by-title-page.component';

describe('BrowseByTitlePageComponent', () => {
  let comp: BrowseByTitlePageComponent;
  let fixture: ComponentFixture<BrowseByTitlePageComponent>;
  let itemDataService: ItemDataService;
  let route: ActivatedRoute;

  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    metadata: [
      {
        key: 'dc.title',
        value: 'test community',
      },
    ],
  });

  const mockItems = [
    Object.assign(new Item(), {
      id: 'fakeId',
      metadata: [
        {
          key: 'dc.title',
          value: 'Fake Title',
        },
      ],
    }),
  ];

  const mockBrowseService = {
    getBrowseItemsFor: () => toRemoteData(mockItems),
    getBrowseEntriesFor: () => toRemoteData([]),
  };

  const mockDsoService = {
    findById: () => createSuccessfulRemoteDataObject$(mockCommunity),
  };

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({}),
    data: observableOf({ metadata: 'title' }),
  });

  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NgbModule,
      ],
      declarations: [BrowseByTitlePageComponent, EnumKeysPipe, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BrowseService, useValue: mockBrowseService },
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
        { provide: PaginationService, useValue: paginationService },
        { provide: Router, useValue: new RouterMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByTitlePageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    itemDataService = (comp as any).itemDataService;
    route = (comp as any).route;
  });

  it('should initialize the list of items', () => {
    comp.items$.subscribe((result) => {
      expect(result.payload.page).toEqual(mockItems);
    });
  });
});
