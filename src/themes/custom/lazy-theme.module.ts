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
import { AdminSidebarComponent } from './app/admin/admin-sidebar/admin-sidebar.component';
import { BreadcrumbsComponent } from './app/breadcrumbs/breadcrumbs.component';
import { BrowseBySwitcherComponent } from './app/browse-by/browse-by-switcher/browse-by-switcher.component';
import { CollectionPageComponent } from './app/collection-page/collection-page.component';
import { EditItemTemplatePageComponent } from './app/collection-page/edit-item-template-page/edit-item-template-page.component';
import { CommunityListPageComponent } from './app/community-list-page/community-list-page.component';
import { CommunityListComponent } from './app/community-list-page/community-list/community-list.component';
import { CommunityPageComponent } from './app/community-page/community-page.component';
import { ForbiddenComponent } from './app/forbidden/forbidden.component';
import { ForgotEmailComponent } from './app/forgot-password/forgot-password-email/forgot-email.component';
import { ForgotPasswordFormComponent } from './app/forgot-password/forgot-password-form/forgot-password-form.component';
import { HomePageComponent } from './app/home-page/home-page.component';
import { EndUserAgreementComponent } from './app/info/end-user-agreement/end-user-agreement.component';
import { FeedbackComponent } from './app/info/feedback/feedback.component';
import { PrivacyComponent } from './app/info/privacy/privacy.component';
import { ItemMetadataComponent } from './app/item-page/edit-item-page/item-metadata/item-metadata.component';
import { FullItemPageComponent } from './app/item-page/full/full-item-page.component';
import { FileSectionComponent } from './app/item-page/simple/field-components/file-section/file-section.component';
import { ItemPageComponent } from './app/item-page/simple/item-page.component';
import { LoginPageComponent } from './app/login-page/login-page.component';
import { LogoutPageComponent } from './app/logout-page/logout-page.component';
import { ObjectNotFoundComponent } from './app/lookup-by-id/objectnotfound/objectnotfound.component';
import { MyDSpacePageComponent } from './app/my-dspace-page/my-dspace-page.component';
import { ExpandableNavbarSectionComponent } from './app/navbar/expandable-navbar-section/expandable-navbar-section.component';
import { PageNotFoundComponent } from './app/pagenotfound/pagenotfound.component';
import { ProfilePageComponent } from './app/profile-page/profile-page.component';
import { CreateProfileComponent } from './app/register-page/create-profile/create-profile.component';
import { RegisterEmailComponent } from './app/register-page/register-email/register-email.component';
import { RootComponent } from './app/root/root.component';
import { ConfigurationSearchPageComponent } from './app/search-page/configuration-search-page.component';
import { SearchPageComponent } from './app/search-page/search-page.component';
import { AuthNavMenuComponent } from './app/shared/auth-nav-menu/auth-nav-menu.component';
import { LoadingComponent } from './app/shared/loading/loading.component';
import { SearchResultsComponent } from './app/shared/search/search-results/search-results.component';
import { CollectionStatisticsPageComponent } from './app/statistics-page/collection-statistics-page/collection-statistics-page.component';
import { CommunityStatisticsPageComponent } from './app/statistics-page/community-statistics-page/community-statistics-page.component';
import { ItemStatisticsPageComponent } from './app/statistics-page/item-statistics-page/item-statistics-page.component';
import { SiteStatisticsPageComponent } from './app/statistics-page/site-statistics-page/site-statistics-page.component';
import { SubmissionEditComponent } from './app/submission/edit/submission-edit.component';
import { SubmissionImportExternalComponent } from './app/submission/import-external/submission-import-external.component';
import { SubmissionSubmitComponent } from './app/submission/submit/submission-submit.component';
import { WorkflowItemDeleteComponent } from './app/workflowitems-edit-page/workflow-item-delete/workflow-item-delete.component';
import { WorkflowItemSendBackComponent } from './app/workflowitems-edit-page/workflow-item-send-back/workflow-item-send-back.component';

const DECLARATIONS = [
  FileSectionComponent,
  HomePageComponent,
  RootComponent,
  BrowseBySwitcherComponent,
  CommunityListPageComponent,
  SearchPageComponent,
  ConfigurationSearchPageComponent,
  EndUserAgreementComponent,
  PageNotFoundComponent,
  ObjectNotFoundComponent,
  ForbiddenComponent,
  PrivacyComponent,
  CollectionStatisticsPageComponent,
  CommunityStatisticsPageComponent,
  ItemStatisticsPageComponent,
  SiteStatisticsPageComponent,
  CommunityPageComponent,
  CollectionPageComponent,
  ItemPageComponent,
  FullItemPageComponent,
  LoginPageComponent,
  LogoutPageComponent,
  CreateProfileComponent,
  ForgotEmailComponent,
  ForgotPasswordFormComponent,
  ProfilePageComponent,
  RegisterEmailComponent,
  MyDSpacePageComponent,
  SubmissionEditComponent,
  SubmissionImportExternalComponent,
  SubmissionSubmitComponent,
  WorkflowItemDeleteComponent,
  WorkflowItemSendBackComponent,
  BreadcrumbsComponent,
  FeedbackComponent,
  CommunityListComponent,
  AuthNavMenuComponent,
  ExpandableNavbarSectionComponent,
  ItemMetadataComponent,
  EditItemTemplatePageComponent,
  LoadingComponent,
  SearchResultsComponent,
  AdminSidebarComponent,
];

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
