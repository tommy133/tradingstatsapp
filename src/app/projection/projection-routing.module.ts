import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectionListComponent } from './projection-list/projection-list.component';



const routes: Routes = [
  { path: 'projections', component: ProjectionListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectionRoutingModule { }
