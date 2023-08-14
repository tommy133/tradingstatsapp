import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';

export type ChartType = 'line' | 'pie';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  chart?: Highcharts.Chart;
  public initializeLineChart(data: (number | null)[]) {
    this.chart = Highcharts.chart('line', {
      title: {
        text: 'Incremental Performance',
      },
      yAxis: {
        title: {
          text: 'Points',
        },
      },
      series: [
        {
          type: 'line',
          name: 'Number of operations',
          data: data,
          color: '#32CD32',
        },
      ],
    });
  }

  public initializePieChart(data: (number | null)[]) {
    this.chart = Highcharts.chart('pie', {
      title: {
        text: 'Performance Ratio',
      },

      series: [
        {
          type: 'pie',
          data: data,
        },
      ],
    });
  }

  public updateChart(data: (number | null)[]) {
    if (this.chart) {
      this.chart.series[0].setData(data);
    }
  }

  public destroyChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
