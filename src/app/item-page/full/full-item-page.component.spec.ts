import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { MetadataService } from '../../core/metadata/metadata.service';
import { Item } from '../../core/shared/item.model';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { TruncatePipe } from '../../shared/utils/truncate.pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { createRelationshipsObservable } from '../simple/item-types/shared/item.component.spec';
import { FullItemPageComponent } from './full-item-page.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'test item',
      },
    ],
  },
});

const mockWithdrawnItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  metadata: [],
  relationships: createRelationshipsObservable(),
  isWithdrawn: true,
});

const metadataServiceStub = {
  /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
  processRemoteData: () => {},
  /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
};

describe('FullItemPageComponent', () => {
  let comp: FullItemPageComponent;
  let fixture: ComponentFixture<FullItemPageComponent>;

  let authService: AuthService;
  let routeStub: ActivatedRouteStub;
  let routeData;
  let authorizationDataService: AuthorizationDataService;

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {},
    });

    routeData = {
      dso: createSuccessfulRemoteDataObject(mockItem),
    };

    routeStub = Object.assign(new ActivatedRouteStub(), {
      data: observableOf(routeData),
    });

    authorizationDataService = jasmine.createSpyObj(
      'authorizationDataService',
      {
        isAuthorized: observableOf(false),
      }
    );

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      declarations: [FullItemPageComponent, TruncatePipe, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ItemDataService, useValue: {} },
        { provide: MetadataService, useValue: metadataServiceStub },
        { provide: AuthService, useValue: authService },
        {
          provide: AuthorizationDataService,
          useValue: authorizationDataService,
        },
      ],

      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(FullItemPageComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FullItemPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should display the item's metadata", () => {
    const table = fixture.debugElement.query(By.css('table'));
    for (const metadatum of mockItem.allMetadata([])) {
      expect(table.nativeElement.innerHTML).toContain(metadatum.value);
    }
  });

  it('should show simple view button when not originated from workflow item', () => {
    expect(comp.fromSubmissionObject).toBe(false);
    const simpleViewBtn = fixture.debugElement.query(
      By.css('.simple-view-link')
    );
    expect(simpleViewBtn).toBeTruthy();
  });

  it('should not show simple view button when originated from workflow', fakeAsync(() => {
    routeData.wfi = createSuccessfulRemoteDataObject$({ id: 'wfiId' });
    comp.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.fromSubmissionObject).toBe(true);
      const simpleViewBtn = fixture.debugElement.query(
        By.css('.simple-view-link')
      );
      expect(simpleViewBtn).toBeFalsy();
    });
  }));

  describe('when the item is withdrawn and the user is an admin', () => {
    beforeEach(() => {
      comp.isAdmin$ = observableOf(true);
      comp.itemRD$ = new BehaviorSubject<RemoteData<Item>>(
        createSuccessfulRemoteDataObject(mockWithdrawnItem)
      );
      fixture.detectChanges();
    });

    it('should display the item', () => {
      const objectLoader = fixture.debugElement.query(
        By.css('.full-item-info')
      );
      expect(objectLoader.nativeElement).toBeDefined();
    });
  });
  describe('when the item is withdrawn and the user is not an admin', () => {
    beforeEach(() => {
      comp.itemRD$ = new BehaviorSubject<RemoteData<Item>>(
        createSuccessfulRemoteDataObject(mockWithdrawnItem)
      );
      fixture.detectChanges();
    });

    it('should not display the item', () => {
      const objectLoader = fixture.debugElement.query(
        By.css('.full-item-info')
      );
      expect(objectLoader).toBeNull();
    });
  });

  describe('when the item is not withdrawn and the user is an admin', () => {
    beforeEach(() => {
      comp.isAdmin$ = observableOf(true);
      comp.itemRD$ = new BehaviorSubject<RemoteData<Item>>(
        createSuccessfulRemoteDataObject(mockItem)
      );
      fixture.detectChanges();
    });

    it('should display the item', () => {
      const objectLoader = fixture.debugElement.query(
        By.css('.full-item-info')
      );
      expect(objectLoader.nativeElement).toBeDefined();
    });
  });

  describe('when the item is not withdrawn and the user is not an admin', () => {
    beforeEach(() => {
      comp.itemRD$ = new BehaviorSubject<RemoteData<Item>>(
        createSuccessfulRemoteDataObject(mockItem)
      );
      fixture.detectChanges();
    });

    it('should display the item', () => {
      const objectLoader = fixture.debugElement.query(
        By.css('.full-item-info')
      );
      expect(objectLoader.nativeElement).toBeDefined();
    });
  });
});
