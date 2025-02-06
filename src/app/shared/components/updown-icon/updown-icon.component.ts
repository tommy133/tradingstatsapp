import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-updown-icon',
  template: `
    <svg-icon
      *ngIf="updown !== null"
      [svgStyle]="{
        'height.px': 32,
        'width.px': 32,
        'fill': updown ? 'green' : 'red'
      }"
      class="flex justify-center"
      [ngClass]="updown ? '-rotate-90' : 'rotate-90'"
      src="assets/svg/go-right-nofilled.svg"
    ></svg-icon>
  `,
})
export class UpdownIconComponent {
  @Input() updown: number | null = null;
}
