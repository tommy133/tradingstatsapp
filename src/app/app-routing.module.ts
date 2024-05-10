import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatsGuard } from './core/service/stats.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { OperationLayoutComponent } from './layout/operation-layout/operation-layout.component';
import { ProjectionLayoutComponent } from './layout/projection-layout/projection-layout.component';
import { StatsLayoutComponent } from './layout/stats-layout/stats-layout.component';
import { LoginComponent } from './modules/authentication/pages/login/login.component';
import { OperationsGuard } from './modules/operation/guards/operations.guard';

const pageRoutes: Routes = [
  { path: '', redirectTo: 'projections', pathMatch: 'full' },
  {
    path: 'projections',
    component: ProjectionLayoutComponent,
    loadChildren: () =>
      import('./modules/projection/projection.module').then(
        (m) => m.ProjectionModule,
      ),
  },
  {
    path: 'operations',
    component: OperationLayoutComponent,
    canActivate: [OperationsGuard],
    loadChildren: () =>
      import('./modules/operation/operation.module').then(
        (m) => m.OperationModule,
      ),
  },
  {
    path: 'stats',
    canActivate: [StatsGuard],
    component: StatsLayoutComponent,
    loadChildren: () =>
      import('./modules/stats/stats.module').then((m) => m.StatsModule),
  },
];

const routes: Routes = [
  {
    path: 'authentication',
    component: LoginComponent, //replace for LoginLayoutComponent
  },
  { path: '', component: MainLayoutComponent, children: pageRoutes },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
