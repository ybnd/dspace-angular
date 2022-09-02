import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { HomeNewsComponent } from './home-news/home-news.component';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { ThemedHomePageComponent } from './themed-home-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';

const DECLARATIONS = [
  HomePageComponent,
  ThemedHomePageComponent,
  TopLevelCommunityListComponent,
  ThemedHomeNewsComponent,
  HomeNewsComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomePageRoutingModule,
    StatisticsModule.forRoot(),
  ],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class HomePageModule {}
