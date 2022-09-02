import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { IdlePreloadModule } from 'angular-idle-preload';
import { AdminRegistriesModule } from '../../app/admin/admin-registries/admin-registries.module';
import { BitstreamFormatsModule } from '../../app/admin/admin-registries/bitstream-formats/bitstream-formats.module';
import { AdminSearchModule } from '../../app/admin/admin-search-page/admin-search.module';
import { AdminWorkflowModuleModule } from '../../app/admin/admin-workflow-page/admin-workflow.module';
import { AppModule } from '../../app/app.module';
import { BrowseByModule } from '../../app/browse-by/browse-by.module';
import { CollectionFormModule } from '../../app/collection-page/collection-form/collection-form.module';
import { CollectionPageModule } from '../../app/collection-page/collection-page.module';
import { CommunityListPageModule } from '../../app/community-list-page/community-list-page.module';
import { CommunityFormModule } from '../../app/community-page/community-form/community-form.module';
import { CommunityPageModule } from '../../app/community-page/community-page.module';
import { CoreModule } from '../../app/core/core.module';
import { JournalEntitiesModule } from '../../app/entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../../app/entity-groups/research-entities/research-entities.module';
import { HomePageModule } from '../../app/home-page/home-page.module';
import { InfoModule } from '../../app/info/info.module';
import { EditItemPageModule } from '../../app/item-page/edit-item-page/edit-item-page.module';
import { ItemPageModule } from '../../app/item-page/item-page.module';
import { MyDSpacePageModule } from '../../app/my-dspace-page/my-dspace-page.module';
import { MyDspaceSearchModule } from '../../app/my-dspace-page/my-dspace-search.module';
import { NavbarModule } from '../../app/navbar/navbar.module';
import { ProfilePageModule } from '../../app/profile-page/profile-page.module';
import { RegisterEmailFormModule } from '../../app/register-email-form/register-email-form.module';
import { RootModule } from '../../app/root.module';
import { SearchPageModule } from '../../app/search-page/search-page.module';
import { ComcolModule } from '../../app/shared/comcol/comcol.module';
import { MenuModule } from '../../app/shared/menu/menu.module';
import { ResourcePoliciesModule } from '../../app/shared/resource-policies/resource-policies.module';
import { SearchModule } from '../../app/shared/search/search.module';
import { SharedModule } from '../../app/shared/shared.module';
import { StatisticsPageModule } from '../../app/statistics-page/statistics-page.module';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { SubmissionModule } from '../../app/submission/submission.module';

const DECLARATIONS = [];

@NgModule({
  imports: [
    AdminRegistriesModule,
    AdminSearchModule,
    AdminWorkflowModuleModule,
    AppModule,
    RootModule,
    BitstreamFormatsModule,
    BrowseByModule,
    CollectionFormModule,
    CollectionPageModule,
    CommonModule,
    CommunityFormModule,
    CommunityListPageModule,
    CommunityPageModule,
    CoreModule,
    DragDropModule,
    ItemPageModule,
    EditItemPageModule,
    FormsModule,
    HomePageModule,
    HttpClientModule,
    IdlePreloadModule,
    InfoModule,
    JournalEntitiesModule,
    MenuModule,
    MyDspaceSearchModule,
    NavbarModule,
    NgbModule,
    ProfilePageModule,
    RegisterEmailFormModule,
    ResearchEntitiesModule,
    RouterModule,
    ScrollToModule,
    SearchPageModule,
    SharedModule,
    StatisticsModule,
    StatisticsPageModule,
    StoreModule,
    StoreRouterConnectingModule,
    TranslateModule,
    SubmissionModule,
    MyDSpacePageModule,
    MyDspaceSearchModule,
    SearchModule,
    FormsModule,
    ResourcePoliciesModule,
    ComcolModule,
  ],
  declarations: DECLARATIONS,
})

/**
 * This module serves as an index for all the components in this theme.
 * It should import all other modules, so the compiler knows where to find any components referenced
 * from a component in this theme
 * It is purposefully not exported, it should never be imported anywhere else, its only purpose is
 * to give lazily loaded components a context in which they can be compiled successfully
 */
class LazyThemeModule {}
