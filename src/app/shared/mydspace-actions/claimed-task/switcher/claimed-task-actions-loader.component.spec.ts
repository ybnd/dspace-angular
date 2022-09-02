import {
  ChangeDetectionStrategy,
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RequestService } from '../../../../core/data/request.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { PoolTaskDataService } from '../../../../core/tasks/pool-task-data.service';
import { getMockRequestService } from '../../../mocks/request.service.mock';
import { getMockSearchService } from '../../../mocks/search-service.mock';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { RouterStub } from '../../../testing/router.stub';
import { ClaimedTaskActionsEditMetadataComponent } from '../edit-metadata/claimed-task-actions-edit-metadata.component';
import { ClaimedTaskActionsLoaderComponent } from './claimed-task-actions-loader.component';
import { ClaimedTaskActionsDirective } from './claimed-task-actions.directive';

const searchService = getMockSearchService();

const requestService = getMockRequestService();

describe('ClaimedTaskActionsLoaderComponent', () => {
  let comp: ClaimedTaskActionsLoaderComponent;
  let fixture: ComponentFixture<ClaimedTaskActionsLoaderComponent>;

  const option = 'test_option';
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        ClaimedTaskActionsLoaderComponent,
        ClaimedTaskActionsEditMetadataComponent,
        ClaimedTaskActionsDirective,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ClaimedTaskDataService, useValue: {} },
        { provide: Injector, useValue: {} },
        {
          provide: NotificationsService,
          useValue: new NotificationsServiceStub(),
        },
        { provide: Router, useValue: new RouterStub() },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestService },
        { provide: PoolTaskDataService, useValue: {} },
      ],
    })
      .overrideComponent(ClaimedTaskActionsLoaderComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
          entryComponents: [ClaimedTaskActionsEditMetadataComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsLoaderComponent);
    comp = fixture.componentInstance;
    comp.object = object;
    comp.option = option;
    spyOn(comp, 'getComponentByWorkflowTaskOption').and.returnValue(
      ClaimedTaskActionsEditMetadataComponent
    );

    fixture.detectChanges();
  }));

  describe('When the component is rendered', () => {
    it('should call the getComponentByWorkflowTaskOption function with the right option', () => {
      expect(comp.getComponentByWorkflowTaskOption).toHaveBeenCalledWith(
        option
      );
    });
  });
});
