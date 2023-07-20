import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  template: `<button type="button">
    <svg-icon
      [svgClass]="iconSvgClass"
      [svgStyle]="iconSvgStyle"
      [src]="iconSource"
    >
    </svg-icon>
  </button>`,
})
export class IconButtonComponent {
  constructor() {}

  @Input() iconSource!: string;
  @Input() iconSvgStyle?: any = { 'height.px': 32, 'width.px': 32 };
  @Input() iconSvgClass?: string;
  @Output() clickEvent = new EventEmitter<any>();
}
