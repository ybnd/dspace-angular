import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ItemPageModule } from '../item-page/item-page.module';
import { SharedModule } from '../shared/shared.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { SubmissionModule } from '../submission/submission.module';
import { ThemedWorkflowItemDeleteComponent } from './workflow-item-delete/themed-workflow-item-delete.component';
import { WorkflowItemDeleteComponent } from './workflow-item-delete/workflow-item-delete.component';
import { ThemedWorkflowItemSendBackComponent } from './workflow-item-send-back/themed-workflow-item-send-back.component';
import { WorkflowItemSendBackComponent } from './workflow-item-send-back/workflow-item-send-back.component';
import { WorkflowItemsEditPageRoutingModule } from './workflowitems-edit-page-routing.module';

@NgModule({
  imports: [
    WorkflowItemsEditPageRoutingModule,
    CommonModule,
    SharedModule,
    SubmissionModule,
    StatisticsModule,
    ItemPageModule,
  ],
  declarations: [
    WorkflowItemDeleteComponent,
    ThemedWorkflowItemDeleteComponent,
    WorkflowItemSendBackComponent,
    ThemedWorkflowItemSendBackComponent,
  ],
})
/**
 * This module handles all modules that need to access the workflowitems edit page.
 */
export class WorkflowItemsEditPageModule {}
