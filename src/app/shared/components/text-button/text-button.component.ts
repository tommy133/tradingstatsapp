import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-text-button',
  template: `<button type="button" (click)="emitEvent()">
    <div [ngClass]="buttonClass" style="flex; flex-row; align-items: center;">
      <h5 style="text-align: center;">{{ buttonText }}</h5>
    </div>
  </button> `,
})
export class TextButtonComponent {
  @Input() buttonText!: string;
  @Input() buttonClass?: string;
  @Output() clickEvent = new EventEmitter<any>();

  constructor() {}

  emitEvent() {
    this.clickEvent.emit();
  }
}
