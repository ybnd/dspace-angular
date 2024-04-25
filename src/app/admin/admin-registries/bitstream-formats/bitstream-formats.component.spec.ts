import { CommonModule } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  cold,
  getTestScheduler,
  hot,
} from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { APP_DATA_SERVICES_MAP } from '../../../../config/app-config.interface';
import { BitstreamFormatDataService } from '../../../core/data/bitstream-format-data.service';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { BitstreamFormat } from '../../../core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../../core/shared/bitstream-format-support-level';
import { XSRFService } from '../../../core/xsrf/xsrf.service';
import { HostWindowService } from '../../../shared/host-window.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import {
  createFailedRemoteDataObject$,
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { BitstreamFormatsComponent } from './bitstream-formats.component';

describe('BitstreamFormatsComponent', () => {
  let comp: BitstreamFormatsComponent;
  let fixture: ComponentFixture<BitstreamFormatsComponent>;
  let bitstreamFormatService;
  let scheduler: TestScheduler;
  let notificationsServiceStub;
  let paginationService;

  const bitstreamFormat1 = new BitstreamFormat();
  bitstreamFormat1.uuid = 'test-uuid-1';
  bitstreamFormat1.id = 'test-uuid-1';
  bitstreamFormat1.shortDescription = 'Unknown';
  bitstreamFormat1.description = 'Unknown data format';
  bitstreamFormat1.mimetype = 'application/octet-stream';
  bitstreamFormat1.supportLevel = BitstreamFormatSupportLevel.Unknown;
  bitstreamFormat1.internal = false;
  bitstreamFormat1.extensions = null;

  const bitstreamFormat2 = new BitstreamFormat();
  bitstreamFormat2.uuid = 'test-uuid-2';
  bitstreamFormat2.id = 'test-uuid-2';
  bitstreamFormat2.shortDescription = 'License';
  bitstreamFormat2.description = 'Item-specific license agreed upon to submission';
  bitstreamFormat2.mimetype = 'text/plain; charset=utf-8';
  bitstreamFormat2.supportLevel = BitstreamFormatSupportLevel.Known;
  bitstreamFormat2.internal = true;
  bitstreamFormat2.extensions = null;

  const bitstreamFormat3 = new BitstreamFormat();
  bitstreamFormat3.uuid = 'test-uuid-3';
  bitstreamFormat3.id = 'test-uuid-3';
  bitstreamFormat3.shortDescription = 'CC License';
  bitstreamFormat3.description = 'Item-specific Creative Commons license agreed upon to submission';
  bitstreamFormat3.mimetype = 'text/html; charset=utf-8';
  bitstreamFormat3.supportLevel = BitstreamFormatSupportLevel.Supported;
  bitstreamFormat3.internal = true;
  bitstreamFormat3.extensions = null;

  const bitstreamFormat4 = new BitstreamFormat();
  bitstreamFormat4.uuid = 'test-uuid-4';
  bitstreamFormat4.id = 'test-uuid-4';
  bitstreamFormat4.shortDescription = 'Adobe PDF';
  bitstreamFormat4.description = 'Adobe Portable Document Format';
  bitstreamFormat4.mimetype = 'application/pdf';
  bitstreamFormat4.supportLevel = BitstreamFormatSupportLevel.Unknown;
  bitstreamFormat4.internal = false;
  bitstreamFormat4.extensions = null;

  const mockFormatsList: BitstreamFormat[] = [
    bitstreamFormat1,
    bitstreamFormat2,
    bitstreamFormat3,
    bitstreamFormat4,
  ];
  const mockFormatsRD = createSuccessfulRemoteDataObject(createPaginatedList(mockFormatsList));

  const initAsync = () => {
    notificationsServiceStub = new NotificationsServiceStub();

    scheduler = getTestScheduler();

    bitstreamFormatService = jasmine.createSpyObj('bitstreamFormatService', {
      findAll: observableOf(mockFormatsRD),
      find: createSuccessfulRemoteDataObject$(mockFormatsList[0]),
      getSelectedBitstreamFormats: hot('a', { a: mockFormatsList }),
      selectBitstreamFormat: {},
      deselectBitstreamFormat: {},
      deselectAllBitstreamFormats: {},
      delete: createSuccessfulRemoteDataObject$({}),
      clearBitStreamFormatRequests: observableOf('cleared'),
    });

    const groupDataService = jasmine.createSpyObj('groupsDataService', {
      findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
      getGroupRegistryRouterLink: '',
      getUUIDFromString: '',
    });


    const configurationDataService = jasmine.createSpyObj('ConfigurationDataService', {
      findByPropertyName: observableOf({ payload: { value: 'test' } }),
    });

    paginationService = new PaginationServiceStub();

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, BitstreamFormatsComponent, PaginationComponent, EnumKeysPipe],
      providers: [
        provideMockStore(),
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: BitstreamFormatDataService, useValue: bitstreamFormatService },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: NotificationsService, useValue: notificationsServiceStub },
        { provide: PaginationService, useValue: paginationService },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: XSRFService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  };

  const initBeforeEach = () => {
    fixture = TestBed.createComponent(BitstreamFormatsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Bitstream format page content', () => {
    beforeEach(waitForAsync(initAsync));
    beforeEach(initBeforeEach);

    it('should contain four formats', () => {
      const tbody: HTMLElement = fixture.debugElement.query(By.css('#formats>tbody')).nativeElement;
      expect(tbody.children.length).toBe(4);
    });

    it('should contain the correct formats', () => {
      const unknownName: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(1) td:nth-child(3)')).nativeElement;
      expect(unknownName.textContent).toBe('Unknown');

      const UUID: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(1) td:nth-child(2)')).nativeElement;
      expect(UUID.textContent).toBe('test-uuid-1');

      const licenseName: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(2) td:nth-child(3)')).nativeElement;
      expect(licenseName.textContent).toBe('License');

      const ccLicenseName: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(3) td:nth-child(3)')).nativeElement;
      expect(ccLicenseName.textContent).toBe('CC License');

      const adobeName: HTMLElement = fixture.debugElement.query(By.css('#formats tr:nth-child(4) td:nth-child(3)')).nativeElement;
      expect(adobeName.textContent).toBe('Adobe PDF');
    });
  });

  describe('selectBitStreamFormat', () => {
    beforeEach(waitForAsync(initAsync));
    beforeEach(initBeforeEach);
    it('should select a bitstreamFormat if it was selected in the event', () => {
      const event = { target: { checked: true } };

      comp.selectBitStreamFormat(bitstreamFormat1, event);

      expect(bitstreamFormatService.selectBitstreamFormat).toHaveBeenCalledWith(bitstreamFormat1);
    });
    it('should deselect a bitstreamFormat if it is deselected in the event', () => {
      const event = { target: { checked: false } };

      comp.selectBitStreamFormat(bitstreamFormat1, event);

      expect(bitstreamFormatService.deselectBitstreamFormat).toHaveBeenCalledWith(bitstreamFormat1);
    });
    it('should be called when a user clicks a checkbox', () => {
      spyOn(comp, 'selectBitStreamFormat');
      const unknownFormat = fixture.debugElement.query(By.css('#formats tr:nth-child(1) input'));

      const event = { target: { checked: true } };
      unknownFormat.triggerEventHandler('change', event);

      expect(comp.selectBitStreamFormat).toHaveBeenCalledWith(bitstreamFormat1, event);
    });
  });

  describe('isSelected', () => {
    beforeEach(waitForAsync(initAsync));
    beforeEach(initBeforeEach);
    it('should return an observable of true if the provided bistream is in the list returned by the service', () => {
      const result = comp.isSelected(bitstreamFormat1);

      expect(result).toBeObservable(cold('b', { b: true }));
    });
    it('should return an observable of false if the provided bistream is not in the list returned by the service', () => {
      const format = new BitstreamFormat();
      format.uuid = 'new';

      const result = comp.isSelected(format);

      expect(result).toBeObservable(cold('b', { b: false }));
    });
  });

  describe('deselectAll', () => {
    beforeEach(waitForAsync(initAsync));
    beforeEach(initBeforeEach);
    it('should deselect all bitstreamFormats', () => {
      comp.deselectAll();
      expect(bitstreamFormatService.deselectAllBitstreamFormats).toHaveBeenCalled();
    });

    it('should be called when the deselect all button is clicked', () => {
      spyOn(comp, 'deselectAll');
      const deselectAllButton = fixture.debugElement.query(By.css('button.deselect'));
      deselectAllButton.triggerEventHandler('click', null);

      expect(comp.deselectAll).toHaveBeenCalled();

    });
  });

  describe('deleteFormats success', () => {
    beforeEach(waitForAsync(() => {
      notificationsServiceStub = new NotificationsServiceStub();

      scheduler = getTestScheduler();

      bitstreamFormatService = jasmine.createSpyObj('bitstreamFormatService', {
        findAll: observableOf(mockFormatsRD),
        find: createSuccessfulRemoteDataObject$(mockFormatsList[0]),
        getSelectedBitstreamFormats: observableOf(mockFormatsList),
        selectBitstreamFormat: {},
        deselectBitstreamFormat: {},
        deselectAllBitstreamFormats: {},
        delete: createNoContentRemoteDataObject$(),
        clearBitStreamFormatRequests: observableOf('cleared'),
      });

      const groupDataService = jasmine.createSpyObj('groupsDataService', {
        findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
        getGroupRegistryRouterLink: '',
        getUUIDFromString: '',
      });

      const configurationDataService = jasmine.createSpyObj('ConfigurationDataService', {
        findByPropertyName: observableOf({ payload: { value: 'test' } }),
      });

      paginationService = new PaginationServiceStub();

      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule,
          BitstreamFormatsComponent, PaginationComponent, EnumKeysPipe],
        providers: [
          provideMockStore(),
          { provide: BitstreamFormatDataService, useValue: bitstreamFormatService },
          { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
          { provide: NotificationsService, useValue: notificationsServiceStub },
          { provide: PaginationService, useValue: paginationService },
          { provide: GroupDataService, useValue: groupDataService },
          { provide: ConfigurationDataService, useValue: configurationDataService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(BitstreamFormatsComponent, {
          remove: { imports: [PaginationComponent] },
          add: { imports: [TestPaginationComponent] },
        })
        .compileComponents();
    },
    ));

    beforeEach(initBeforeEach);
    it('should clear bitstream formats and show a success notification', () => {
      comp.deleteFormats();

      expect(bitstreamFormatService.clearBitStreamFormatRequests).toHaveBeenCalled();
      expect(bitstreamFormatService.delete).toHaveBeenCalledWith(bitstreamFormat1.id);
      expect(bitstreamFormatService.delete).toHaveBeenCalledWith(bitstreamFormat2.id);
      expect(bitstreamFormatService.delete).toHaveBeenCalledWith(bitstreamFormat3.id);
      expect(bitstreamFormatService.delete).toHaveBeenCalledWith(bitstreamFormat4.id);

      expect(notificationsServiceStub.success).toHaveBeenCalledWith('admin.registries.bitstream-formats.delete.success.head',
        'admin.registries.bitstream-formats.delete.success.amount');
      expect(notificationsServiceStub.error).not.toHaveBeenCalled();

    });
  });

  describe('deleteFormats error', () => {
    beforeEach(waitForAsync(() => {
      notificationsServiceStub = new NotificationsServiceStub();

      scheduler = getTestScheduler();

      bitstreamFormatService = jasmine.createSpyObj('bitstreamFormatService', {
        findAll: observableOf(mockFormatsRD),
        find: createSuccessfulRemoteDataObject$(mockFormatsList[0]),
        getSelectedBitstreamFormats: observableOf(mockFormatsList),
        selectBitstreamFormat: {},
        deselectBitstreamFormat: {},
        deselectAllBitstreamFormats: {},
        delete: createFailedRemoteDataObject$(),
        clearBitStreamFormatRequests: observableOf('cleared'),
      });

      const groupDataService = jasmine.createSpyObj('groupsDataService', {
        findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
        getGroupRegistryRouterLink: '',
        getUUIDFromString: '',
      });

      const configurationDataService = jasmine.createSpyObj('ConfigurationDataService', {
        findByPropertyName: observableOf({ payload: { value: 'test' } }),
      });

      paginationService = new PaginationServiceStub();

      TestBed.configureTestingModule({
        imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, BitstreamFormatsComponent, PaginationComponent, EnumKeysPipe],
        providers: [
          provideMockStore(),
          { provide: BitstreamFormatDataService, useValue: bitstreamFormatService },
          { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
          { provide: NotificationsService, useValue: notificationsServiceStub },
          { provide: PaginationService, useValue: paginationService },
          { provide: PaginationService, useValue: paginationService },
          { provide: GroupDataService, useValue: groupDataService },
          { provide: ConfigurationDataService, useValue: configurationDataService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(BitstreamFormatsComponent, {
          remove: { imports: [PaginationComponent] },
          add: { imports: [TestPaginationComponent] },
        })
        .compileComponents();
    },
    ));

    beforeEach(initBeforeEach);
    it('should clear bitstream formats and show an error notification', () => {
      comp.deleteFormats();

      expect(bitstreamFormatService.clearBitStreamFormatRequests).toHaveBeenCalled();
      expect(bitstreamFormatService.delete).toHaveBeenCalledWith(bitstreamFormat1.id);
      expect(bitstreamFormatService.delete).toHaveBeenCalledWith(bitstreamFormat2.id);
      expect(bitstreamFormatService.delete).toHaveBeenCalledWith(bitstreamFormat3.id);
      expect(bitstreamFormatService.delete).toHaveBeenCalledWith(bitstreamFormat4.id);

      expect(notificationsServiceStub.error).toHaveBeenCalledWith('admin.registries.bitstream-formats.delete.failure.head',
        'admin.registries.bitstream-formats.delete.failure.amount');
      expect(notificationsServiceStub.success).not.toHaveBeenCalled();
    });
  });
});

@Component({
  exportAs: 'paginationComponent',
  selector: 'ds-pagination',
  template: ``,
  standalone: true,
})
export class TestPaginationComponent {
}
