import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';

export type ChartType = 'line' | 'pie';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  lineChart?: Highcharts.Chart;
  pieChart?: Highcharts.Chart;

  public initializeLineChart(data: (number | null)[]) {
    this.lineChart = Highcharts.chart('line', {
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

  public initializePieChart(data: (any | null)[]) {
    this.pieChart = Highcharts.chart('pie', {
      title: {
        text: 'Performance Ratio',
      },

      series: [
        {
          type: 'pie',
          data: this.processPieChartData(data),
        },
      ],
    });
  }

  public updateChart(data: (number | null)[], chartType: ChartType) {
    switch (chartType) {
      case 'line':
        this.lineChart?.series[0].setData(data);
        break;
      case 'pie':
        this.pieChart?.series[0].setData(this.processPieChartData(data));
        break;
    }
  }

  private processPieChartData(data: (number | null)[]) {
    const ratio = this.calculatePLRatio(data);
    return [
      { name: 'Benefit', color: '#32CD32', y: ratio },
      { name: 'Loss', color: 'red', y: 1 - ratio },
    ];
  }

  private calculatePLRatio(data: (number | null)[]) {
    const positive = data.filter((res) => res !== null && res > 0).length;
    const total = data.filter((res) => res !== null).length;
    return positive / total;
  }
}
