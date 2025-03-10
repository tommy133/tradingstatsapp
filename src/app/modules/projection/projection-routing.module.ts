import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectionDetailsComponent } from './pages/projection/projection-details/projection-details.component';
import { ProjectionListComponent } from './pages/projection/projection-list/projection-list.component';
import { ProjectionMutationComponent } from './pages/projection/projection-mutation/projection-mutation.component';
import { ViewChartComponent } from './pages/view-chart/view-chart.component';

const routes: Routes = [
  {
    path: 'view-chart/:id',
    component: ViewChartComponent,
    children: [
      {
        path: '',
        component: ProjectionDetailsComponent,
        data: {
          showViewChartBtn: false,
        },
      },
      {
        path: 'edit',
        component: ProjectionMutationComponent,
      },
    ],
  },
  {
    path: '',
    component: ProjectionListComponent,
    children: [
      {
        path: 'add',
        component: ProjectionMutationComponent,
      },
      {
        path: ':id/edit',
        component: ProjectionMutationComponent,
      },
      {
        path: ':id',
        component: ProjectionDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectionRoutingModule {}
