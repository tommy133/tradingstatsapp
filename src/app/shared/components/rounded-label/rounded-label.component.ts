import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rounded-label',
  template: `<label
    [class]="bgColor + ' ' + textColor + ' rounded-full px-5 py-2'"
  >
    {{ text }}
  </label> `,
})
export class RoundedLabelComponent {
  @Input() text: string = '';
  @Input() bgColor: string = 'bg-light-grey';
  @Input() textColor: string = 'text-black';
}
