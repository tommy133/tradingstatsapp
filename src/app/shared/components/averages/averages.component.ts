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
          ><p>Time operation (min): {{ avgTimeOperation }}</p>
        </app-label>
        <app-label
          ><p>Ratio: {{ avgRatio }}</p>
        </app-label>
        <app-label
          ><p>Revenue: {{ avgRevenue }}</p>
        </app-label>
      </div>
    </app-label>
  `,
})
export class AveragesComponent {
  @Input() data: Operation[] = [];

  get avgTimeOperation() {
    const durations = this.data.map((op) => {
      //assume we evaluate always closed positions
      const startTime = new Date(op.dateOpen!).getTime();
      const endTime = new Date(op.dateClose!).getTime();
      if (endTime - startTime < 0) {
        console.log(op.dateOpen + ' ' + op.dateClose);
      }

      return endTime - startTime;
    });

    const totalDuration = durations.reduce(
      (acc, duration) => acc + duration,
      0,
    );

    const averageDuration = totalDuration / durations.length;
    const averageDurationInMinutes = (averageDuration / (1000 * 60)).toFixed(2);
    return averageDurationInMinutes;
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
