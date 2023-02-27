import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { MatTableModule } from '@angular/material/table';




@NgModule({
  declarations: [
    NavbarComponent,
    TableComponent
  ],
  imports: [ 
    CommonModule, RouterModule, MatTableModule
  ],
  exports: [
    NavbarComponent,
    TableComponent
  ]

})
export class SharedModule { }
