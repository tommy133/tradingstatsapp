import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { StatsFiltersFormComponent } from './pages/view-stats/stats-filters-form/stats-filters-form.component';
import { ViewStatsComponent } from './pages/view-stats/view-stats.component';
import { StatsRoutingModule } from './stats.routing.module';

@NgModule({
  declarations: [
    ViewStatsComponent,
    StatsFiltersFormComponent,
    LineChartComponent,
    PieChartComponent,
  ],
  imports: [CommonModule, StatsRoutingModule, HttpClientModule, SharedModule],
  providers: [HttpClient],
})
export class StatsModule {}
