import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-icon-button',
  template: `<button type="button" class="hover:bg-gray-500 rounded-md">
    <div [ngClass]="buttonClass" class="flex gap-2 px-2">
      <svg-icon
        [svgClass]="iconSvgClass"
        [svgStyle]="iconSvgStyle"
        [src]="iconSource"
      ></svg-icon>
      <h5>{{ buttonText }}</h5>
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
