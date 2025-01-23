import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzCardModule } from "ng-zorro-antd/card";
import { LoginFormComponent } from './features/landing/login-form/login-form.component';
import { ContentComponent } from './features/landing/content/content.component';
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EventsListComponent } from './features/event/events-list/events-list.component';
import { CreateEventComponent } from './features/event/create-event/create-event.component';
import { NzSelectModule } from "ng-zorro-antd/select";
import { AuthInterceptor } from "./core/auth/interceptors/auth.interceptor";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterOutlet } from "@angular/router";
import { DefaultComponent } from './layout/default/default.component';
import { DefLayoutContentModule } from "./layout/default/def-layout-content/def-layout-content.module";
import { SharedZorroModule } from './shared/shared-zorro.module';
import { DefaultModule } from './layout/default/default.module';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './features/landing/header/header.component';
import { EventModule } from './features/event/event.module';
import { ProfileModule } from "./features/profile/profile.module";
import { ResetPasswordComponent } from './features/landing/reset-password/reset-password.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginFormComponent,
    ContentComponent,
    DefaultComponent,
    ResetPasswordComponent,
  ],
  imports: [
    SharedZorroModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzTabsModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzSpinModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    RouterOutlet,
    DefLayoutContentModule,
    DefaultModule,
    SharedModule,
    EventModule,
    ProfileModule
],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
