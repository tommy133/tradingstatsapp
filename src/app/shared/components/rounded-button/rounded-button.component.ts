import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rounded-button',
  template: `<button
    [ngClass]="bgColor + ' ' + styles"
    [routerLink]="routerLink"
    [type]="type"
    [disabled]="disabled"
  >
    {{ text }}
  </button> `,
})
export class RoundedButtonComponent {
  @Input() text: string = '';
  @Input() bgColor: string = 'bg-green';
  @Input() styles: string = 'rounded-full text-white px-5 py-2';
  @Input() routerLink?: string;
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
}
