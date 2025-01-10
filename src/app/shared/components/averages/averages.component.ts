import { Component, Input } from '@angular/core';
import { Operation } from 'src/app/modules/operation/model/operation';

@Component({
  selector: 'app-averages',
  template: `
    <app-label
      bgColor="bg-dark"
      textColor="text-white"
      styles="inline-flex items-center justify-center rounded-md p-4 font-semibold text-sm"
    >
      <div class="flex flex-col gap-4">
        <p class="font-semibold text-base">Averages</p>
        <app-label
          ><p>
            Time operation: {{ avgTimeOperationInMinutes }} (min) |
            {{ avgTimeOperationInHours }} (hours)
          </p>
        </app-label>
        <app-label
          ><p>Ratio: {{ avgRatio }}</p>
        </app-label>
      </div>
    </app-label>
  `,
})
export class AveragesComponent {
  @Input() data: Operation[] = [];

  get avgTimeOperation() {
    const durations = this.data.map((op) => {
      if (op.dateOpen && op.dateClose) {
        const startTime = new Date(op.dateOpen).getTime();
        const endTime = new Date(op.dateClose).getTime();

        return endTime - startTime;
      }
      return 0;
    });

    const totalDuration = durations.reduce(
      (acc, duration) => acc + duration,
      0,
    );

    return totalDuration / durations.length;
  }

  get avgTimeOperationInMinutes() {
    return (this.avgTimeOperation / (1000 * 60)).toFixed(2);
  }

  get avgTimeOperationInHours() {
    return (this.avgTimeOperation / (1000 * 60 * 60)).toFixed(2);
  }

  get avgRatio() {
    const ratios = this.data
      .map((data) => data.ratio)
      .filter((ratio) => ratio != undefined) as number[];
    const totalRatio = ratios.reduce((acc, ratio) => acc + ratio, 0);
    return (totalRatio / ratios.length).toFixed(2);
  }

  get avgRevenue() {
    const revenues = this.data
      .map((data) => data.revenue)
      .filter((revenue) => revenue != undefined) as number[];
    const totalRevenue = revenues.reduce((acc, revenue) => acc + revenue, 0);
    return (totalRevenue / revenues.length).toFixed(2);
  }
}
