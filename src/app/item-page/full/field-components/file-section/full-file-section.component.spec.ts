import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { MockBitstreamFormat1 } from '../../../../shared/mocks/item.mock';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { MetadataFieldWrapperComponent } from '../../../field-components/metadata-field-wrapper/metadata-field-wrapper.component';
import { FullFileSectionComponent } from './full-file-section.component';

describe('FullFileSectionComponent', () => {
  let comp: FullFileSectionComponent;
  let fixture: ComponentFixture<FullFileSectionComponent>;

  const mockBitstream: Bitstream = Object.assign(new Bitstream(), {
    sizeBytes: 10201,
    content:
      'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
    format: observableOf(MockBitstreamFormat1),
    bundleName: 'ORIGINAL',
    _links: {
      self: {
        href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713',
      },
      content: {
        href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
      },
    },
    id: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
    uuid: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
    type: 'bitstream',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test_word.docx',
        },
      ],
    },
  });

  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findAllByItemAndBundleName: createSuccessfulRemoteDataObject$(
      createPaginatedList([mockBitstream, mockBitstream, mockBitstream])
    ),
  });

  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        BrowserAnimationsModule,
      ],
      declarations: [
        FullFileSectionComponent,
        VarDirective,
        FileSizePipe,
        MetadataFieldWrapperComponent,
      ],
      providers: [
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        {
          provide: NotificationsService,
          useValue: new NotificationsServiceStub(),
        },
        { provide: PaginationService, useValue: paginationService },
      ],

      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FullFileSectionComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('when the full file section gets loaded with bitstreams available', () => {
    it('should contain a list with bitstreams', () => {
      const fileSection = fixture.debugElement.queryAll(
        By.css('.file-section')
      );
      expect(fileSection.length).toEqual(6);
    });
  });
});
