import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { OperationLayoutComponent } from './layout/operation-layout/operation-layout.component';
import { ProjectionLayoutComponent } from './layout/projection-layout/projection-layout.component';
import { HomeComponent } from './modules/home/pages/home/home.component';

const pageRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
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
    loadChildren: () =>
      import('./modules/operation/operation.module').then(
        (m) => m.OperationModule,
      ),
  },
];

const routes: Routes = [
  { path: '', component: MainLayoutComponent, children: pageRoutes },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
