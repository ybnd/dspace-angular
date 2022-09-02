import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BundleDataService } from '../../core/data/bundle-data.service';
import { SearchPageModule } from '../../search-page/search-page.module';
import { ResourcePoliciesModule } from '../../shared/resource-policies/resource-policies.module';
import { SharedModule } from '../../shared/shared.module';
import { ObjectValuesPipe } from '../../shared/utils/object-values-pipe';
import { AbstractItemUpdateComponent } from './abstract-item-update/abstract-item-update.component';
import { EditItemPageComponent } from './edit-item-page.component';
import { EditItemPageRoutingModule } from './edit-item-page.routing.module';
import { ItemAuthorizationsComponent } from './item-authorizations/item-authorizations.component';
import { ItemBitstreamsComponent } from './item-bitstreams/item-bitstreams.component';
import { ItemEditBitstreamBundleComponent } from './item-bitstreams/item-edit-bitstream-bundle/item-edit-bitstream-bundle.component';
import { PaginatedDragAndDropBitstreamListComponent } from './item-bitstreams/item-edit-bitstream-bundle/paginated-drag-and-drop-bitstream-list/paginated-drag-and-drop-bitstream-list.component';
import { ItemEditBitstreamDragHandleComponent } from './item-bitstreams/item-edit-bitstream-drag-handle/item-edit-bitstream-drag-handle.component';
import { ItemEditBitstreamComponent } from './item-bitstreams/item-edit-bitstream/item-edit-bitstream.component';
import { ItemCollectionMapperComponent } from './item-collection-mapper/item-collection-mapper.component';
import { ItemDeleteComponent } from './item-delete/item-delete.component';
import { EditInPlaceFieldComponent } from './item-metadata/edit-in-place-field/edit-in-place-field.component';
import { ItemMetadataComponent } from './item-metadata/item-metadata.component';
import { ThemedItemMetadataComponent } from './item-metadata/themed-item-metadata.component';
import { ItemMoveComponent } from './item-move/item-move.component';
import { ItemOperationComponent } from './item-operation/item-operation.component';
import { ItemPrivateComponent } from './item-private/item-private.component';
import { ItemPublicComponent } from './item-public/item-public.component';
import { ItemReinstateComponent } from './item-reinstate/item-reinstate.component';
import { EditRelationshipListComponent } from './item-relationships/edit-relationship-list/edit-relationship-list.component';
import { EditRelationshipComponent } from './item-relationships/edit-relationship/edit-relationship.component';
import { ItemRelationshipsComponent } from './item-relationships/item-relationships.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import { ItemVersionHistoryComponent } from './item-version-history/item-version-history.component';
import { ItemWithdrawComponent } from './item-withdraw/item-withdraw.component';
import { AbstractSimpleItemActionComponent } from './simple-item-action/abstract-simple-item-action.component';
import { VirtualMetadataComponent } from './virtual-metadata/virtual-metadata.component';

/**
 * Module that contains all components related to the Edit Item page administrator functionality
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbTooltipModule,
    EditItemPageRoutingModule,
    SearchPageModule,
    DragDropModule,
    ResourcePoliciesModule,
    NgbModule,
  ],
  declarations: [
    EditItemPageComponent,
    ItemOperationComponent,
    AbstractSimpleItemActionComponent,
    AbstractItemUpdateComponent,
    ItemWithdrawComponent,
    ItemReinstateComponent,
    ItemPrivateComponent,
    ItemPublicComponent,
    ItemDeleteComponent,
    ItemStatusComponent,
    ItemMetadataComponent,
    ThemedItemMetadataComponent,
    ItemRelationshipsComponent,
    ItemBitstreamsComponent,
    ItemVersionHistoryComponent,
    EditInPlaceFieldComponent,
    ItemEditBitstreamComponent,
    ItemEditBitstreamBundleComponent,
    PaginatedDragAndDropBitstreamListComponent,
    EditInPlaceFieldComponent,
    EditRelationshipComponent,
    EditRelationshipListComponent,
    ItemCollectionMapperComponent,
    ItemMoveComponent,
    ItemEditBitstreamDragHandleComponent,
    VirtualMetadataComponent,
    ItemAuthorizationsComponent,
  ],
  providers: [BundleDataService, ObjectValuesPipe],
  exports: [EditInPlaceFieldComponent, ThemedItemMetadataComponent],
})
export class EditItemPageModule {}
