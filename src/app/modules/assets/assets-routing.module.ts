import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetDetailsComponent } from './pages/asset/asset-details/asset-details.component';
import { AssetListComponent } from './pages/asset/asset-list/asset-list.component';
import { AssetMutationComponent } from './pages/asset/asset-mutation/asset-mutation.component';

const routes: Routes = [
  {
    path: '',
    component: AssetListComponent,
    children: [
      {
        path: 'add',
        component: AssetMutationComponent,
      },
      {
        path: ':id/edit',
        component: AssetMutationComponent,
      },
      {
        path: ':id',
        component: AssetDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsRoutingModule {}
