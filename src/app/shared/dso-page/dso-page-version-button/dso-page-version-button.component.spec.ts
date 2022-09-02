import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of as observableOf, of } from 'rxjs';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { Item } from '../../../core/shared/item.model';
import { DsoPageVersionButtonComponent } from './dso-page-version-button.component';

describe('DsoPageVersionButtonComponent', () => {
  let component: DsoPageVersionButtonComponent;
  let fixture: ComponentFixture<DsoPageVersionButtonComponent>;

  let authorizationService: AuthorizationDataService;
  let versionHistoryService: VersionHistoryDataService;

  let dso: Item;
  let tooltipMsg: Observable<string>;

  const authorizationServiceSpy = jasmine.createSpyObj('authorizationService', [
    'isAuthorized',
  ]);

  const versionHistoryServiceSpy = jasmine.createSpyObj(
    'versionHistoryService',
    [
      'getVersions',
      'getLatestVersionFromHistory$',
      'isLatest$',
      'hasDraftVersion$',
    ]
  );

  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' },
        version: { href: 'test-item-version-selflink' },
      },
    });
    tooltipMsg = of('tooltip-msg');

    TestBed.configureTestingModule({
      declarations: [DsoPageVersionButtonComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        NgbModule,
      ],
      providers: [
        {
          provide: AuthorizationDataService,
          useValue: authorizationServiceSpy,
        },
        {
          provide: VersionHistoryDataService,
          useValue: versionHistoryServiceSpy,
        },
      ],
    }).compileComponents();

    authorizationService = TestBed.inject(AuthorizationDataService);
    versionHistoryService = TestBed.inject(VersionHistoryDataService);

    versionHistoryServiceSpy.hasDraftVersion$.and.returnValue(
      observableOf(true)
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoPageVersionButtonComponent);
    component = fixture.componentInstance;
    component.dso = dso;
    component.tooltipMsg$ = tooltipMsg;
    fixture.detectChanges();
  });

  it('should check the authorization of the current user', () => {
    expect(authorizationService.isAuthorized).toHaveBeenCalledWith(
      FeatureID.CanCreateVersion,
      dso.self
    );
  });

  it('should check if the item has a draft version', () => {
    expect(versionHistoryServiceSpy.hasDraftVersion$).toHaveBeenCalledWith(
      dso._links.version.href
    );
  });

  describe('when the user is authorized', () => {
    beforeEach(() => {
      authorizationServiceSpy.isAuthorized.and.returnValue(observableOf(true));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render a button', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button).not.toBeNull();
    });
  });

  describe('when the user is not authorized', () => {
    beforeEach(() => {
      authorizationServiceSpy.isAuthorized.and.returnValue(observableOf(false));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render a button', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button).toBeNull();
    });
  });
});
