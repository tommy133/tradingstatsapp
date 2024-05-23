import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AutosizeModule } from 'ngx-autosize';
import { SharedModule } from 'src/app/shared/shared.module';
import { OperationRoutingModule } from './operation-routing.module';
import { OperationDetailsComponent } from './pages/operation/operation-details/operation-details.component';
import { OperationFiltersFormComponent } from './pages/operation/operation-list/operation-filters-form/operation-filters-form.component';
import { OperationListComponent } from './pages/operation/operation-list/operation-list.component';
import { TableOperationComponent } from './pages/operation/operation-list/table-operation/table-operation.component';
import { OperationMutationComponent } from './pages/operation/operation-mutation/operation-mutation.component';
import { ViewChartComponent } from './pages/view-chart/view-chart.component';
import { RulesComponent } from './pages/rules/rules/rules.component';

@NgModule({
  declarations: [
    OperationListComponent,
    TableOperationComponent,
    OperationDetailsComponent,
    OperationMutationComponent,
    ViewChartComponent,
    OperationFiltersFormComponent,
    RulesComponent,
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    HttpClientModule,
    SharedModule,
    AutosizeModule,
  ],
  providers: [HttpClient, DatePipe],
})
export class OperationModule {}
