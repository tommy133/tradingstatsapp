import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-back-to',
  template: `
    <app-text-icon-button
      [buttonText]="backText"
      buttonClass="flex flex-row items-center space-x-1 text-white font-semibold"
      iconSource="assets/svg/arrow-left.svg"
      [routerLink]="backTo"
      [queryParams]="queryParams"
    >
    </app-text-icon-button>
  `,
})
export class BackToComponent {
  @Input() backText = 'Back previous';
  @Input() backTo = '../';
  @Input() queryParams: any;
}
