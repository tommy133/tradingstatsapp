import { NgModule } from '@angular/core';

import { ProjectionRoutingModule } from './projection-routing.module';
import { ProjectionListComponent } from './projection-list/projection-list.component';
import { SharedModule } from '../shared/shared.module';
import { TableProjectionComponent } from './projection-list/table/table-projection.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProjectionAddComponent } from './projection-add/projection-add.component';
import { ProjectionDetailsComponent } from './projection-details/projection-details.component';
import { ProjectionEditComponent } from './projection-edit/projection-edit.component';

@NgModule({
  declarations: [ProjectionListComponent, TableProjectionComponent, ProjectionAddComponent, ProjectionDetailsComponent, ProjectionEditComponent],
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
