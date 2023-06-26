import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationListComponent } from './pages/operation/operation-list/operation-list.component';

const routes: Routes = [{ path: '', component: OperationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
