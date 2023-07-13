import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-close-button',
  template: `
    <a
      [routerLink]="routerLink"
      class="text-4xl font-semibold text-white inline-block transform rotate-45"
      >+</a
    >
  `,
})
export class CloseButtonComponent {
  @Input() routerLink: string = '/';
}
