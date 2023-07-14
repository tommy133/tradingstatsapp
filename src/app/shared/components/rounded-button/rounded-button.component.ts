import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rounded-button',
  template: `<button
    [class]="bgColor + ' rounded-full text-white px-5 py-2'"
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
  @Input() routerLink?: string;
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
}
