import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TradingviewWidgetModule } from 'angular-tradingview-widget';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectionAddComponent } from './pages/projection/projection-add/projection-add.component';
import { ProjectionDetailsComponent } from './pages/projection/projection-details/projection-details.component';
import { ProjectionEditComponent } from './pages/projection/projection-edit/projection-edit.component';
import { ProjectionListComponent } from './pages/projection/projection-list/projection-list.component';
import { TableProjectionComponent } from './pages/projection/projection-list/table/table-projection.component';
import { ViewChartComponent } from './pages/view-chart/view-chart.component';
import { ProjectionRoutingModule } from './projection-routing.module';

@NgModule({
  declarations: [
    ProjectionListComponent,
    TableProjectionComponent,
    ProjectionAddComponent,
    ProjectionDetailsComponent,
    ProjectionEditComponent,
    ViewChartComponent,
  ],
  imports: [
    CommonModule,
    ProjectionRoutingModule,
    HttpClientModule,
    SharedModule,
    FileUploadModule,
    TradingviewWidgetModule,
  ],
  providers: [HttpClient],
  exports: [ProjectionListComponent],
})
export class ProjectionModule {}
