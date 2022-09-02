import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchService } from '../core/shared/search/search.service';
import { EditItemPageModule } from '../item-page/edit-item-page/edit-item-page.module';
import { ComcolModule } from '../shared/comcol/comcol.module';
import { SharedModule } from '../shared/shared.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { CollectionFormModule } from './collection-form/collection-form.module';
import { CollectionItemMapperComponent } from './collection-item-mapper/collection-item-mapper.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { CollectionPageComponent } from './collection-page.component';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { EditItemTemplatePageComponent } from './edit-item-template-page/edit-item-template-page.component';
import { ThemedEditItemTemplatePageComponent } from './edit-item-template-page/themed-edit-item-template-page.component';
import { ThemedCollectionPageComponent } from './themed-collection-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CollectionPageRoutingModule,
    StatisticsModule.forRoot(),
    EditItemPageModule,
    CollectionFormModule,
    ComcolModule,
  ],
  declarations: [
    CollectionPageComponent,
    ThemedCollectionPageComponent,
    CreateCollectionPageComponent,
    DeleteCollectionPageComponent,
    EditItemTemplatePageComponent,
    ThemedEditItemTemplatePageComponent,
    CollectionItemMapperComponent,
  ],
  providers: [SearchService],
})
export class CollectionPageModule {}
