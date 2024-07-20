import {
  AfterViewInit,
  Component,
  inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import { ChartService, ChartType } from 'src/app/core/service/chart.service';
import { Operation } from 'src/app/modules/operation/model/operation';

@Component({
  selector: 'app-line-chart',
  template: '<div [id]="CHART_TYPE"></div>',
})
export class LineChartComponent implements AfterViewInit {
  private chartService = inject(ChartService);

  @Input() data: Operation[] = [];

  readonly CHART_TYPE: ChartType = 'line';

  ngAfterViewInit() {
    this.chartService.initializeLineChart(
      this.data.map(({ revenue }) => revenue ?? null),
    );
    const sortedAccumulatedData = this.getSortedAccumulatedData(this.data);
    this.chartService.updateChart(sortedAccumulatedData, this.CHART_TYPE);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const sortedAccumulatedData = this.getSortedAccumulatedData(this.data);
      this.chartService.updateChart(sortedAccumulatedData, this.CHART_TYPE);
    }
  }

  private getSortedAccumulatedData(operation: Operation[]) {
    return operation
      .sort(
        (a, b) =>
          new Date(a.dateOpen!).getTime() - new Date(b.dateOpen!).getTime(),
      )
      .reduce((accumulatedData: number[], operation) => {
        const previousTotal =
          accumulatedData.length > 0
            ? accumulatedData[accumulatedData.length - 1]
            : 0;
        const currentRevenue = operation.revenue ?? 0;
        const newTotal = previousTotal + currentRevenue;
        accumulatedData.push(newTotal);
        return accumulatedData;
      }, []);
  }
}
