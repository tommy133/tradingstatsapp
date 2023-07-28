import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationDetailsComponent } from './pages/operation/operation-details/operation-details.component';
import { OperationListComponent } from './pages/operation/operation-list/operation-list.component';

const routes: Routes = [
  {
    path: '',
    component: OperationListComponent,
    children: [
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
