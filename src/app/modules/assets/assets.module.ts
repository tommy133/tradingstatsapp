import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AutosizeModule } from 'ngx-autosize';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssetsRoutingModule } from './assets-routing.module';
import { AssetListComponent } from './pages/asset/asset-list/asset-list.component';
import { AssetMutationComponent } from './pages/asset/asset-mutation/asset-mutation.component';
import { TableAssetComponent } from './pages/asset/asset-list/table-asset/table-asset.component';
import { AssetDetailsComponent } from './pages/asset/asset-details/asset-details.component';

@NgModule({
  declarations: [AssetListComponent, AssetMutationComponent, TableAssetComponent, AssetDetailsComponent],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    HttpClientModule,
    SharedModule,
    AutosizeModule,
  ],
  providers: [HttpClient],
})
export class AssetsModule {}
