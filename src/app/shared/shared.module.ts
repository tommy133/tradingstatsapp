import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingTemplateComponent } from './loading-template/loading-template.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [NavbarComponent, SpinnerComponent, LoadingTemplateComponent],
  imports: [CommonModule, RouterModule],
  exports: [NavbarComponent, SpinnerComponent, LoadingTemplateComponent],
})
export class SharedModule {}
