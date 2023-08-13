import { Component, OnInit, inject } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subscription } from 'rxjs';
import { OperationService } from 'src/app/modules/operation/service/operation.service';

@Component({
  selector: 'app-chart',
  template: '<div id="chartContainer" ></div>',
})
export class ChartComponent implements OnInit {
  private operationService = inject(OperationService);

  private subscription?: Subscription;
  chart?: Highcharts.Chart;
  private data: (number | null)[] = [];

  operationData$ = this.operationService.operations$;

  ngOnInit() {
    this.subscription = this.operationData$.subscribe((operations) => {
      this.data = operations
        .filter((operation) => operation.account.id_ac === 1)
        .sort(
          (a, b) =>
            new Date(a.dateOpen!).getTime() - new Date(b.dateOpen!).getTime(),
        )
        .reduce((accumulatedData: number[], operation) => {
          const previousTotal =
            accumulatedData.length > 0
              ? accumulatedData[accumulatedData.length - 1]
              : 0;
          const currentPoints = operation.points ?? 0;
          const newTotal = previousTotal + currentPoints;
          accumulatedData.push(newTotal);
          return accumulatedData;
        }, []);
      this.updateChart();
    });

    this.initializeLineChart();
  }

  private initializeLineChart() {
    this.chart = Highcharts.chart('chartContainer', {
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
          data: this.data,
          color: '#32CD32',
        },
      ],
    });
  }

  private updateChart() {
    if (this.chart) {
      this.chart.series[0].setData(this.data);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      if (this.chart) {
        this.chart.destroy();
      }
    }
  }
}
