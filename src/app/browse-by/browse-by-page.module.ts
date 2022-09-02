import { NgModule } from '@angular/core';
import { BrowseService } from '../core/browse/browse.service';
import { ItemDataService } from '../core/data/item-data.service';
import { BrowseByGuard } from './browse-by-guard';
import { BrowseByRoutingModule } from './browse-by-routing.module';
import { BrowseByModule } from './browse-by.module';

@NgModule({
  imports: [BrowseByRoutingModule, BrowseByModule.withEntryComponents()],
  providers: [ItemDataService, BrowseService, BrowseByGuard],
})
export class BrowseByPageModule {}
