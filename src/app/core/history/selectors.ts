import { createSelector } from '@ngrx/store';
import { CoreState } from '../core-state.model';
import { coreSelector } from '../core.selectors';

export const historySelector = createSelector(
  coreSelector,
  (state: CoreState) => state.history
);
