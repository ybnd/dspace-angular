import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { PersonListElementComponent } from './person-list-element.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'person.jobTitle': [
      {
        language: 'en_US',
        value: 'Developer',
      },
    ],
  },
});

describe('PersonListElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PersonListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(PersonListElementComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PersonListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the person is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a PersonListElementComponent`, () => {
      const personListElement = fixture.debugElement.query(
        By.css(`ds-person-search-result-list-element`)
      );
      expect(personListElement).not.toBeNull();
    });
  });
});
