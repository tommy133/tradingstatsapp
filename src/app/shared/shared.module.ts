import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingTemplateComponent } from './components/loading-template/loading-template.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [NavbarComponent, SpinnerComponent, LoadingTemplateComponent],
  imports: [CommonModule, RouterModule],
  exports: [NavbarComponent, SpinnerComponent, LoadingTemplateComponent],
})
export class SharedModule {}
