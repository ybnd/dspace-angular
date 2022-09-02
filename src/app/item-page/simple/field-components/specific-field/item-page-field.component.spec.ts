import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Item } from '../../../../core/shared/item.model';
import {
  MetadataMap,
  MetadataValue,
} from '../../../../core/shared/metadata.models';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { MetadataValuesComponent } from '../../../field-components/metadata-values/metadata-values.component';
import { ItemPageFieldComponent } from './item-page-field.component';

let comp: ItemPageFieldComponent;
let fixture: ComponentFixture<ItemPageFieldComponent>;

const mockValue = 'test value';
const mockField = 'dc.test';
const mockLabel = 'test label';
const mockFields = [mockField];

describe('ItemPageFieldComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      declarations: [ItemPageFieldComponent, MetadataValuesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ItemPageFieldComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemPageFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldAndValue(mockField, mockValue);
    comp.fields = mockFields;
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});

export function mockItemWithMetadataFieldAndValue(
  field: string,
  value: string
): Item {
  const item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: new MetadataMap(),
  });
  item.metadata[field] = [
    {
      language: 'en_US',
      value: value,
    },
  ] as MetadataValue[];
  return item;
}
