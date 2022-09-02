import { Injectable } from '@angular/core';
import { find, map } from 'rxjs/operators';
import { coreSelector } from 'src/app/core/core.selectors';
import { isNotEmpty } from '../../app/shared/empty.util';
import { StoreAction, StoreActionTypes } from '../../app/store.actions';
import { DSpaceTransferState } from './dspace-transfer-state.service';

@Injectable()
export class DSpaceBrowserTransferState extends DSpaceTransferState {
  transfer(): Promise<boolean> {
    const state = this.transferState.get<any>(
      DSpaceTransferState.NGRX_STATE,
      null
    );
    this.transferState.remove(DSpaceTransferState.NGRX_STATE);
    this.store.dispatch(new StoreAction(StoreActionTypes.REHYDRATE, state));
    return this.store
      .select(coreSelector)
      .pipe(
        find((core: any) => isNotEmpty(core)),
        map(() => true)
      )
      .toPromise();
  }
}
