import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-label',
  template: `<label class="text-white">{{ text }}</label>`,
})
export class FormLabelComponent {
  @Input() text: string = '';
}
