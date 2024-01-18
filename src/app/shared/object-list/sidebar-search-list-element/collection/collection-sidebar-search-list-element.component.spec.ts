import { Collection } from '../../../../core/shared/collection.model';
import { Community } from '../../../../core/shared/community.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { createSidebarSearchListElementTests } from '../sidebar-search-list-element.component.spec';
import { CollectionSidebarSearchListElementComponent } from './collection-sidebar-search-list-element.component';

const object = Object.assign(new CollectionSearchResult(), {
  indexableObject: Object.assign(new Collection(), {
    id: 'test-collection',
    metadata: {
      'dc.title': [
        {
          value: 'title',
        },
      ],
      'dc.description.abstract': [
        {
          value: 'description',
        },
      ],
    },
  }),
});
const parent = Object.assign(new Community(), {
  id: 'test-community',
  metadata: {
    'dc.title': [
      {
        value: 'parent title',
      },
    ],
  },
});

describe(
  'CollectionSidebarSearchListElementComponent',
  createSidebarSearchListElementTests(
    CollectionSidebarSearchListElementComponent,
    object,
    parent,
    'parent title',
    'title',
    'description',
  ),
);
