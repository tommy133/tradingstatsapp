import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
import { NavButton } from 'src/app/shared/utils/custom-types';

@Component({
  selector: 'app-operation-layout',
  templateUrl: './operation-layout.component.html',
  styles: [],
})
export class OperationLayoutComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);

  title: string = 'Trading Stats';
  buttons: NavButton[] = [
    {
      text: 'Projections',
      link: '/projections',
    },
    {
      text: 'Operations',
      link: '/operations',
    },
  ];
  account!: number;

  ngOnInit() {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };
    this.router.navigate(
      [],

      { queryParams: { ...queryParams, account: 1 } },
    );
    this.account = 1;
  }

  get accountType(): string {
    return this.account === 1 ? 'Demo' : 'Live';
  }

  switchAccount() {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };
    this.router.navigate(
      [],

      { queryParams: { ...queryParams, account: this.account === 1 ? 2 : 1 } },
    );
    this.account = this.account === 1 ? 2 : 1;
    this.operationService.refetch();
  }
}
