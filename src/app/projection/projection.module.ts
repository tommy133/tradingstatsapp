import { NgModule } from '@angular/core';


import { ProjectionRoutingModule } from './projection-routing.module';
import { ProjectionListComponent } from './projection-list/projection-list.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
    declarations: [
        ProjectionListComponent,
    ],
    imports: [
        ProjectionRoutingModule,
        SharedModule
    ],
    exports: [
        ProjectionListComponent
    ] 
})
export class ProjectionModule { }
