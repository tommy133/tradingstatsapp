import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AutosizeModule } from 'ngx-autosize';
import { AveragesComponent } from './components/averages/averages.component';
import { BackToComponent } from './components/back-to/back-to.component';
import { CardComponent } from './components/card/card.component';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { CommentReplyComponent } from './components/comment-reply/comment-reply.component';
import { CommentChildrenComponent } from './components/comments-thread/comment-children/comment-children.component';
import { CommentEntryComponent } from './components/comments-thread/comment-entry/comment-entry.component';
import { CommentsThreadComponent } from './components/comments-thread/comments-thread.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { FilterOptionsComponent } from './components/filter-options/filter-options.component';
import { FormLabelComponent } from './components/form-label/form-label.component';
import { HopeComponent } from './components/hope/hope.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { LabelComponent } from './components/label/label.component';
import { LoadingTemplateComponent } from './components/loading-template/loading-template.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
import { RoundedButtonComponent } from './components/rounded-button/rounded-button.component';
import { SearchByTextComponent } from './components/search-by-text/search-by-text.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SymbolSearchComponent } from './components/symbol-search/symbol-search.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { TextButtonComponent } from './components/text-button/text-button.component';
import { TextIconButtonComponent } from './components/text-icon-button/text-icon-button.component';
import { TotalComponent } from './components/total/total.component';
import { TradingviewButtonComponent } from './components/tradingview-button/tradingview-button.component';
import { TrimesterBtnComponent } from './components/trimester-selector/trimester-btn/trimester-btn.component';
import { TrimesterSelectorComponent } from './components/trimester-selector/trimester-selector.component';
import { ValidationErrorComponent } from './components/validation-error/validation-error.component';
import { YearSelectorComponent } from './components/year-selector/year-selector.component';
import { AutoFocusDirective } from './directives/auto-focus.directive';

const componentsAndPipes = [
  NavbarComponent,
  SpinnerComponent,
  LoadingTemplateComponent,
  SidebarComponent,
  RoundedButtonComponent,
  FormLabelComponent,
  CloseButtonComponent,
  ValidationErrorComponent,
  LabelComponent,
  IconButtonComponent,
  TextIconButtonComponent,
  TextButtonComponent,
  SearchByTextComponent,
  CardComponent,
  BackToComponent,
  DatePickerComponent,
  HopeComponent,
  TrimesterSelectorComponent,
  YearSelectorComponent,
  TrimesterBtnComponent,
  FilterOptionsComponent,
  TextAreaComponent,
  NotFoundComponent,
  TradingviewButtonComponent,
  SymbolSearchComponent,
  CommentsThreadComponent,
  CommentEntryComponent,
  AveragesComponent,
  TotalComponent,
  RadioButtonComponent,
  CommentReplyComponent,
  AutoFocusDirective,
];

const sharedModules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  AngularSvgIconModule,
];

@NgModule({
  declarations: [componentsAndPipes, CommentChildrenComponent],
  imports: [...sharedModules, AngularSvgIconModule.forRoot(), AutosizeModule],
  exports: [...componentsAndPipes, ...sharedModules],
})
export class SharedModule {}
