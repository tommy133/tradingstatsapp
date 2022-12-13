import { NgModule } from '@angular/core';
import { OperationListComponent } from './operation-list/operation-list.component';
import { SharedModule } from '../shared/shared.module';
import { OperationRoutingModule } from './operation-routing.module';



@NgModule({
  declarations: [
    OperationListComponent
  ],
  imports: [
    OperationRoutingModule,
    SharedModule
  ],
  exports: [
    OperationListComponent
  ]
})
export class OperationModule { }
