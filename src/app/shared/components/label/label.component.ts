import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  template: `<label [ngClass]="bgColor + ' ' + textColor + ' ' + style">
    {{ text }}
    <ng-content></ng-content>
  </label> `,
})
export class LabelComponent {
  @Input() text: string = '';
  @Input() bgColor: string = 'bg-light-gray';
  @Input() textColor: string = 'text-black';
  @Input() style: string =
    'inline-flex items-center justify-center rounded-md px-2 font-semibold text-sm';
}
