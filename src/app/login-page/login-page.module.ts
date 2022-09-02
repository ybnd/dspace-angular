import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginPageComponent } from './login-page.component';
import { ThemedLoginPageComponent } from './themed-login-page.component';

@NgModule({
  imports: [LoginPageRoutingModule, CommonModule, SharedModule],
  declarations: [LoginPageComponent, ThemedLoginPageComponent],
})
export class LoginPageModule {}
