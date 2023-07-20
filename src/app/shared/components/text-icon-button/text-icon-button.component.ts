import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-icon-button',
  template: `<button type="button">
    <div [ngClass]="buttonClass" style="flex; flex-row; align-items: center;">
      <svg-icon
        [svgClass]="iconSvgClass"
        [svgStyle]="iconSvgStyle"
        [src]="iconSource"
      ></svg-icon>
      <div class="pl-2">
        <h5 style="text-align: center;">{{ buttonText }}</h5>
      </div>
    </div>
  </button> `,
})
export class TextIconButtonComponent {
  @Input() buttonText!: string;
  @Input() buttonClass?: string;

  @Input() iconSource!: string;
  @Input() iconSvgStyle?: any;
  @Input() iconSvgClass?: string;
  constructor() {}
}
