import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { ProjectionModule } from './projection/projection.module';
import { OperationModule } from './operation/operation.module';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ProjectionLayoutComponent } from './layout/projection-layout/projection-layout.component';
import { OperationLayoutComponent } from './layout/operation-layout/operation-layout.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, MainLayoutComponent, ProjectionLayoutComponent, OperationLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ProjectionModule,
    OperationModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
