import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'icon-button',
  template: `<button
    type="button"
    (click)="clickEvent.emit($event)"
    [ngClass]="disabled ? 'opacity-20' : ''"
    [disabled]="disabled"
  >
    <svg-icon
      [svgClass]="iconSvgClass"
      [svgStyle]="iconSvgStyle"
      [src]="iconSource"
    >
    </svg-icon>
  </button>`,
})
export class IconButtonComponent {
  @Input() iconSource!: string;
  @Input() iconSvgStyle?: any = { 'height.px': 32, 'width.px': 32 };
  @Input() iconSvgClass?: string;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Output() clickEvent = new EventEmitter<any>();
}
