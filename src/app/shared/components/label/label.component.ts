import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  template: `<label
    [class]="
      bgColor +
      ' ' +
      textColor +
      ' inline-flex items-center justify-center rounded-md px-2 font-semibold text-sm'
    "
  >
    {{ text }}
  </label> `,
})
export class LabelComponent {
  @Input() text: string = '';
  @Input() bgColor: string = 'bg-light-grey';
  @Input() textColor: string = 'text-black';
}
