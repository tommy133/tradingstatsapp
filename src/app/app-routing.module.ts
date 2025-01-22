import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/pages/login/login.component';
import { AssetLayoutComponent } from './layout/asset-layout/asset-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { OperationLayoutComponent } from './layout/operation-layout/operation-layout.component';
import { ProjectionLayoutComponent } from './layout/projection-layout/projection-layout.component';
import { StatsLayoutComponent } from './layout/stats-layout/stats-layout.component';
import { OperationsGuard } from './modules/operation/guards/operations.guard';
import { ProjectionGuard } from './modules/projection/guards/projection.guard';
import { StatsGuard } from './modules/stats/guards/stats.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const pageRoutes: Routes = [
  { path: '', redirectTo: 'projections', pathMatch: 'full' },
  {
    path: 'projections',
    canActivate: [ProjectionGuard],
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
  {
    path: 'assets',
    component: AssetLayoutComponent,
    loadChildren: () =>
      import('./modules/assets/assets.module').then((m) => m.AssetsModule),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

const routes: Routes = [
  { path: '', component: MainLayoutComponent, children: pageRoutes },
  {
    path: '**',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'not-found' },
      { path: 'not-found', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
