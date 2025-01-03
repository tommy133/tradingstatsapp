import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecklistFormComponent } from './pages/operation/checklist-form/checklist-form.component';
import { OperationDetailsComponent } from './pages/operation/operation-details/operation-details.component';
import { OperationListComponent } from './pages/operation/operation-list/operation-list.component';
import { OperationMutationComponent } from './pages/operation/operation-mutation/operation-mutation.component';
import { RulesComponent } from './pages/rules/rules/rules.component';
import { ViewChartComponent } from './pages/view-chart/view-chart.component';

const routes: Routes = [
  {
    path: 'rules',
    component: RulesComponent,
    children: [
      {
        path: 'add',
        component: OperationMutationComponent,
      },
    ],
  },
  {
    path: 'view-chart/:id',
    component: ViewChartComponent,
    children: [
      {
        path: '',
        component: OperationDetailsComponent,
        data: {
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
        path: 'checklist',
        component: ChecklistFormComponent,
      },
      {
        path: 'add',
        component: OperationMutationComponent,
      },
      {
        path: 'add/assocProjection/:id',
        component: OperationMutationComponent,
      },
      {
        path: ':id/edit',
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
