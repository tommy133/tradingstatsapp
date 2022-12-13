import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationListComponent } from './operation-list/operation-list.component';



const routes: Routes = [
  { path: 'operations', component: OperationListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
