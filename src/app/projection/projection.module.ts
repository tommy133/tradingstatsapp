import { NgModule } from '@angular/core';

import { ProjectionRoutingModule } from './projection-routing.module';
import { ProjectionListComponent } from './projection-list/projection-list.component';
import { SharedModule } from '../shared/shared.module';
import { TableComponent } from './projection-list/table/table.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ProjectionListComponent, TableComponent],
  imports: [
    CommonModule,
    ProjectionRoutingModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [HttpClient],
  exports: [ProjectionListComponent],
})
export class ProjectionModule {}
