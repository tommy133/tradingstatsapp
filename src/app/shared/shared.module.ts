import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingTemplateComponent } from './components/loading-template/loading-template.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarRightComponent } from './components/sidebar-right/sidebar-right.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SpinnerComponent,
    LoadingTemplateComponent,
    SidebarRightComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    NavbarComponent,
    SpinnerComponent,
    LoadingTemplateComponent,
    SidebarRightComponent,
  ],
})
export class SharedModule {}
