import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { OperationLayoutComponent } from './layout/operation-layout/operation-layout.component';
import { ProjectionLayoutComponent } from './layout/projection-layout/projection-layout.component';
import { OperationModule } from './modules/operation/operation.module';
import { ProjectionModule } from './modules/projection/projection.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainLayoutComponent,
    ProjectionLayoutComponent,
    OperationLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ProjectionModule,
    OperationModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
