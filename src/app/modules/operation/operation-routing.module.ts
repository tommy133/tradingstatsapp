import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationDetailsComponent } from './pages/operation/operation-details/operation-details.component';
import { OperationListComponent } from './pages/operation/operation-list/operation-list.component';
import { OperationMutationComponent } from './pages/operation/operation-mutation/operation-mutation.component';
import { RulesComponent } from './pages/rules/rules/rules.component';
import { ViewChartComponent } from './pages/view-chart/view-chart.component';

const routes: Routes = [
  {
    path: 'rules',
    component: RulesComponent,
  },
  {
    path: 'view-chart/:id',
    component: ViewChartComponent,
    children: [
      {
        path: '',
        component: OperationDetailsComponent,
        data: {
          postDeletePath: '../../',
          showViewChartBtn: false,
        },
      },
      {
        path: 'edit',
        component: OperationMutationComponent,
      },
    ],
  },
  {
    path: '',
    component: OperationListComponent,
    children: [
      {
        path: 'addFromProj/:projId',
        component: OperationMutationComponent,
      },
      {
        path: 'add',
        component: OperationMutationComponent,
      },
      {
        path: ':id/edit',
        component: OperationMutationComponent,
      },
      {
        path: ':id',
        component: OperationDetailsComponent,
        data: {
          postDeletePath: '../',
          closeSidebarRedirect: true,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
