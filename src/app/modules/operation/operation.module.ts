import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { OperationRoutingModule } from './operation-routing.module';
import { OperationDetailsComponent } from './pages/operation/operation-details/operation-details.component';
import { OperationListComponent } from './pages/operation/operation-list/operation-list.component';
import { TableOperationComponent } from './pages/operation/operation-list/table-operation/table-operation.component';
import { OperationMutationComponent } from './pages/operation/operation-mutation/operation-mutation.component';

@NgModule({
  declarations: [
    OperationListComponent,
    TableOperationComponent,
    OperationDetailsComponent,
    OperationMutationComponent,
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    HttpClientModule,
    SharedModule,
    FileUploadModule,
  ],
  providers: [HttpClient],
})
export class OperationModule {}
