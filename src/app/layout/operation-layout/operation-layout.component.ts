import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
import { NavButton } from 'src/app/shared/utils/custom-types';

@Component({
  selector: 'app-operation-layout',
  templateUrl: './operation-layout.component.html',
})
export class OperationLayoutComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);
  private toastService = inject(ToastService);

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
    {
      text: 'Stats',
      link: '/stats',
    },
  ];

  account!: string;

  accountSubscription = this.activatedRoute.queryParams.subscribe((params) => {
    const paramAccount = params['account'];
    if (paramAccount === undefined) {
      this.redirectDefaultAccount();
    } else if (paramAccount === '1') {
      this.account = 'Demo';
    } else {
      this.account = 'Live';
    }
  });

  ngOnInit() {
    this.redirectDefaultAccount();
  }

  get accountFromParamOrDefault(): number {
    return this.activatedRoute.snapshot.queryParams['account'] ?? 1;
  }

  get accountSwitched(): number {
    return this.accountFromParamOrDefault?.toString() === '1' ? 2 : 1;
  }

  switchAccount() {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };
    this.router.navigate(
      [],

      { queryParams: { ...queryParams, account: this.accountSwitched } },
    );
    this.operationService.refetch();
    this.toastService.info({
      message: `Switched to ${
        this.accountSwitched === 1 ? 'Demo' : 'Live'
      } account`,
    });
  }

  redirectDefaultAccount() {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };
    if (queryParams['account'] === undefined) {
      this.router.navigate([], {
        queryParams: {
          ...queryParams,
          account: 1,
        },
      });
    }
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }
}
