import { Component, Input } from '@angular/core';
import { Operation } from 'src/app/modules/operation/model/operation';

@Component({
  selector: 'app-total',
  template: `<app-label
    bgColor="bg-dark"
    textColor="text-white"
    styles="inline-flex items-center justify-center rounded-md p-4 font-semibold text-sm"
  >
    <div class="flex flex-col gap-4">
      <p class="font-semibold text-base">Total</p>
      <app-label>
        <p
          [ngClass]="{
            'text-dark-green': total > 0,
            'text-bright-blue': total === 0,
            'text-red': total < 0
          }">
          {{ totalFormatted }}
        </p>
      </app-label>
    </div>
  </app-label>`,
})
export class TotalComponent {
  @Input() data: Operation[] = [];

  get total() {
    return this.data.reduce(
      (acc, operation) => acc + (operation.revenue ?? 0),
      0,
    );
  }

  get totalFormatted() {
    return this.total.toFixed(2);
  }
}
