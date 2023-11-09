import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectionDetailsComponent } from './pages/projection/projection-details/projection-details.component';
import { ProjectionListComponent } from './pages/projection/projection-list/projection-list.component';
import { TableProjectionComponent } from './pages/projection/projection-list/table-projection/table-projection.component';
import { ProjectionMutationComponent } from './pages/projection/projection-mutation/projection-mutation.component';
import { ViewChartComponent } from './pages/view-chart/view-chart.component';
import { ProjectionRoutingModule } from './projection-routing.module';

@NgModule({
  declarations: [
    ProjectionListComponent,
    TableProjectionComponent,
    ProjectionMutationComponent,
    ProjectionDetailsComponent,
    ViewChartComponent,
  ],
  imports: [
    CommonModule,
    ProjectionRoutingModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [HttpClient],
})
export class ProjectionModule {}
