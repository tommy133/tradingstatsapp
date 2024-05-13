import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styles: [],
})
export class AssetListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }
}
