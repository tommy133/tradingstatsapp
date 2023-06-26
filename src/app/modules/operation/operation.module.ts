import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { OperationRoutingModule } from './operation-routing.module';
import { OperationListComponent } from './pages/operation/operation-list/operation-list.component';

@NgModule({
  declarations: [OperationListComponent],
  imports: [CommonModule, OperationRoutingModule, SharedModule],
  exports: [OperationListComponent],
})
export class OperationModule {}
