import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { ChartService, ChartType } from 'src/app/core/service/chart.service';

@Component({
  selector: 'app-pie-chart',
  template: '<div [id]="CHART_TYPE"></div>',
})
export class PieChartComponent {
  private chartService = inject(ChartService);

  @Input() data: (number | null)[] = [];

  readonly CHART_TYPE: ChartType = 'pie';

  ngAfterViewInit() {
    this.chartService.initializePieChart(this.data);
    this.chartService.updateChart(this.data, this.CHART_TYPE);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.chartService.updateChart(this.data, this.CHART_TYPE);
    }
  }
}
