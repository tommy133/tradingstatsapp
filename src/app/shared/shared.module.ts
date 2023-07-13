import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { FormLabelComponent } from './components/form-label/form-label.component';
import { LoadingTemplateComponent } from './components/loading-template/loading-template.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RoundedButtonComponent } from './components/rounded-button/rounded-button.component';
import { SidebarRightComponent } from './components/sidebar-right/sidebar-right.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ValidationErrorComponent } from './components/validation-error/validation-error.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SpinnerComponent,
    LoadingTemplateComponent,
    SidebarRightComponent,
    RoundedButtonComponent,
    FormLabelComponent,
    CloseButtonComponent,
    ValidationErrorComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    ReactiveFormsModule,
    NavbarComponent,
    SpinnerComponent,
    LoadingTemplateComponent,
    SidebarRightComponent,
    RoundedButtonComponent,
    FormLabelComponent,
    CloseButtonComponent,
    ValidationErrorComponent,
  ],
})
export class SharedModule {}
