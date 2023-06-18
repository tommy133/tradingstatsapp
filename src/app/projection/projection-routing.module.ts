import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectionAddComponent } from './projection-add/projection-add.component';
import { ProjectionDetailsComponent } from './projection-details/projection-details.component';
import { ProjectionEditComponent } from './projection-edit/projection-edit.component';
import { ProjectionListComponent } from './projection-list/projection-list.component';

const routes: Routes = [
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
