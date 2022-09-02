import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';
import { MetadataImportPageComponent } from './admin-import-metadata-page/metadata-import-page.component';
import { REGISTRIES_MODULE_PATH } from './admin-routing-paths';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';
import { AdminWorkflowPageComponent } from './admin-workflow-page/admin-workflow-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: REGISTRIES_MODULE_PATH,
        loadChildren: () =>
          import('./admin-registries/admin-registries.module').then(
            (m) => m.AdminRegistriesModule
          ),
      },
      {
        path: 'search',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminSearchPageComponent,
        data: { title: 'admin.search.title', breadcrumbKey: 'admin.search' },
      },
      {
        path: 'workflow',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminWorkflowPageComponent,
        data: {
          title: 'admin.workflow.title',
          breadcrumbKey: 'admin.workflow',
        },
      },
      {
        path: 'curation-tasks',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminCurationTasksComponent,
        data: {
          title: 'admin.curation-tasks.title',
          breadcrumbKey: 'admin.curation-tasks',
        },
      },
      {
        path: 'metadata-import',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: MetadataImportPageComponent,
        data: {
          title: 'admin.metadata-import.title',
          breadcrumbKey: 'admin.metadata-import',
        },
      },
    ]),
  ],
  providers: [I18nBreadcrumbResolver, I18nBreadcrumbsService],
})
export class AdminRoutingModule {}
