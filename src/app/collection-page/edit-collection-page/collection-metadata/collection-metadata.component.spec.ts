import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ItemTemplateDataService } from '../../../core/data/item-template-data.service';
import { RequestService } from '../../../core/data/request.service';
import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { SharedModule } from '../../../shared/shared.module';
import { getCollectionItemTemplateRoute } from '../../collection-page-routing-paths';
import { CollectionMetadataComponent } from './collection-metadata.component';

describe('CollectionMetadataComponent', () => {
  let comp: CollectionMetadataComponent;
  let fixture: ComponentFixture<CollectionMetadataComponent>;
  let router: Router;
  let itemTemplateService: ItemTemplateDataService;

  const template = Object.assign(new Item(), {
    _links: {
      self: { href: 'template-selflink' },
    },
  });
  const collection = Object.assign(new Collection(), {
    uuid: 'collection-id',
    id: 'collection-id',
    name: 'Fake Collection',
    _links: {
      self: { href: 'collection-selflink' },
    },
  });
  const collectionTemplateHref = 'rest/api/test/collections/template';

  const itemTemplateServiceStub = jasmine.createSpyObj('itemTemplateService', {
    findByCollectionID: createSuccessfulRemoteDataObject$(template),
    createByCollectionID: createSuccessfulRemoteDataObject$(template),
    delete: observableOf(true),
    getCollectionEndpoint: observableOf(collectionTemplateHref),
  });

  const notificationsService = jasmine.createSpyObj('notificationsService', {
    success: {},
    error: {},
  });
  const requestService = jasmine.createSpyObj('requestService', {
    setStaleByHrefSubstring: {},
  });

  const routerMock = {
    events: observableOf(new NavigationEnd(1, 'url', 'url')),
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        CommonModule,
        RouterTestingModule,
      ],
      declarations: [CollectionMetadataComponent],
      providers: [
        { provide: CollectionDataService, useValue: {} },
        { provide: ItemTemplateDataService, useValue: itemTemplateServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              data: observableOf({
                dso: createSuccessfulRemoteDataObject(collection),
              }),
            },
          },
        },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: RequestService, useValue: requestService },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionMetadataComponent);
    comp = fixture.componentInstance;
    itemTemplateService = (comp as any).itemTemplateService;
    spyOn(comp, 'ngOnInit');
    spyOn(comp, 'initTemplateItem');

    routerMock.events = observableOf(new NavigationEnd(1, 'url', 'url'));
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/collections/');
    });
  });

  describe('addItemTemplate', () => {
    it("should navigate to the collection's itemtemplate page", () => {
      comp.addItemTemplate();
      expect(routerMock.navigate).toHaveBeenCalledWith([
        getCollectionItemTemplateRoute(collection.uuid),
      ]);
    });
  });

  describe('deleteItemTemplate', () => {
    beforeEach(() => {
      (itemTemplateService.delete as jasmine.Spy).and.returnValue(
        createSuccessfulRemoteDataObject$({}),
      );
      comp.deleteItemTemplate();
    });

    it('should call ItemTemplateService.delete', () => {
      expect(itemTemplateService.delete).toHaveBeenCalledWith(template.uuid);
    });

    describe('when delete returns a success', () => {
      it('should display a success notification', () => {
        expect(notificationsService.success).toHaveBeenCalled();
      });
    });

    describe('when delete returns a failure', () => {
      beforeEach(() => {
        (itemTemplateService.delete as jasmine.Spy).and.returnValue(
          createFailedRemoteDataObject$(),
        );
        comp.deleteItemTemplate();
      });

      it('should display an error notification', () => {
        expect(notificationsService.error).toHaveBeenCalled();
      });
    });
  });
});
