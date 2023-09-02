import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewStatsComponent } from './pages/view-stats/view-stats.component';

const routes: Routes = [
  { path: '', redirectTo: 'view-stats', pathMatch: 'full' },
  {
    path: 'view-stats',
    component: ViewStatsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsRoutingModule {}
