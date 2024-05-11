import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-area',
  template: `<textarea autosize [cols]="cols" class="rounded" readonly>{{
    text
  }}</textarea>`,
})
export class TextAreaComponent {
  @Input() text!: string;
  @Input() cols?: number;
}
