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
        style: {
          color: '#fff',
        },
      },
      chart: {
        backgroundColor: '#333',
      },
      yAxis: {
        title: {
          text: 'Points',
          style: {
            color: '#fff',
            fontSize: '1.2rem',
          },
        },
      },
      series: [
        {
          type: 'line',
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
        style: {
          color: '#fff',
        },
      },
      chart: {
        backgroundColor: '#333',
      },

      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return (
                this.point.name +
                ': ' +
                Highcharts.numberFormat(this.percentage, 2) +
                '%'
              );
            },
            style: {
              color: '#fff',
            },
          },
        },
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

  public calculatePLRatio(data: (number | null)[]) {
    const positive = data.filter((res) => res !== null && res > 0).length;
    const total = data.filter((res) => res !== null && res !== 0).length;
    const res = positive / total;
    return Number(res.toFixed(3));
  }
}
