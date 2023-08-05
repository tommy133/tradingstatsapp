import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationDetailsComponent } from './pages/operation/operation-details/operation-details.component';
import { OperationListComponent } from './pages/operation/operation-list/operation-list.component';
import { OperationMutationComponent } from './pages/operation/operation-mutation/operation-mutation.component';
import { ViewChartComponent } from './pages/view-chart/view-chart.component';

const routes: Routes = [
  {
    path: 'view-chart',
    component: ViewChartComponent,
  },
  {
    path: '',
    component: OperationListComponent,
    children: [
      {
        path: 'add',
        component: OperationMutationComponent,
      },
      {
        path: 'edit/:id',
        component: OperationMutationComponent,
      },
      {
        path: ':id',
        component: OperationDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
