import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-square-button',
  template: `<button [ngClass]="buttonClass" (click)="onClick()">
    <h5 [ngClass]="textClass">{{ text }}</h5>
  </button>`,
})
export class SquareButtonComponent {
  @Input() text: string = '';
  @Input() selected: boolean = false;
  @Output() tokenOutput: EventEmitter<number> = new EventEmitter<number>();
  @Input() token?: number;
  get buttonClass() {
    const defaultClass = 'square-btn';
    const computedClass = this.selected ? 'bg-gray-300' : 'bg-dark';
    return `${defaultClass} ${computedClass}`;
  }

  get textClass() {
    return this.selected ? 'text-black' : 'text-white';
  }

  onClick() {
    this.tokenOutput.emit(this.token);
  }
}
