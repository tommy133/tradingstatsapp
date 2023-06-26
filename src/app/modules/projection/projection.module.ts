import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectionAddComponent } from './pages/projection/projection-add/projection-add.component';
import { ProjectionDetailsComponent } from './pages/projection/projection-details/projection-details.component';
import { ProjectionEditComponent } from './pages/projection/projection-edit/projection-edit.component';
import { ProjectionListComponent } from './pages/projection/projection-list/projection-list.component';
import { TableProjectionComponent } from './pages/projection/projection-list/table/table-projection.component';
import { ProjectionRoutingModule } from './projection-routing.module';

@NgModule({
  declarations: [
    ProjectionListComponent,
    TableProjectionComponent,
    ProjectionAddComponent,
    ProjectionDetailsComponent,
    ProjectionEditComponent,
  ],
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
