import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectionAddComponent } from './pages/projection/projection-add/projection-add.component';
import { ProjectionDetailsComponent } from './pages/projection/projection-details/projection-details.component';
import { ProjectionEditComponent } from './pages/projection/projection-edit/projection-edit.component';
import { ProjectionListComponent } from './pages/projection/projection-list/projection-list.component';
import { ViewChartComponent } from './pages/view-chart/view-chart.component';

const routes: Routes = [
  {
    path: 'view-chart',
    component: ViewChartComponent,
  },
  {
    path: '',
    component: ProjectionListComponent,
    children: [
      {
        path: 'add',
        component: ProjectionAddComponent,
      },
      {
        path: 'edit/:id',
        component: ProjectionEditComponent,
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
