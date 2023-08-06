import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="bg-gray-200 p-4 rounded shadow">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {}
