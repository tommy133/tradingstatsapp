import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
import { AccountType, NavButton } from 'src/app/shared/utils/custom-types';

@Component({
  selector: 'app-operation-layout',
  templateUrl: './operation-layout.component.html',
})
export class OperationLayoutComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);

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

  accountTypes: AccountType[] = ['Demo', 'Live', 'Backtest'];

  accountControl: FormControl<AccountType | null> =
    this.formBuilder.control<AccountType>(this.getDefaultAccount());

  ngOnInit() {
    const account = this.activatedRoute.snapshot.queryParams['account'];
    if (!account) {
      this.redirectDefaultAccount();
    }
  }

  private accountSubscription = this.accountControl.valueChanges.subscribe(
    (account) => {
      if (account) {
        this.switchAccount(account);
        this.operationService.refetch();
      }
    },
  );

  switchAccount(account: AccountType) {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };
    const accountNumber = this.accountTypes.indexOf(account) + 1;
    this.router.navigate([], {
      queryParams: {
        ...queryParams,
        account: accountNumber,
      },
    });
    this.toastService.info({
      message: `Switched to ${account} account`,
    });
  }

  redirectDefaultAccount() {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };
    const accountNumber =
      this.accountTypes.indexOf(this.accountControl.value ?? 'Demo') + 1;
    this.router.navigate([], {
      queryParams: {
        ...queryParams,
        account: accountNumber,
      },
    });
  }

  setDefaultAccount() {
    const account = this.accountControl.value;
    if (account) {
      try {
        localStorage.setItem('defaultAccount', account);
        this.toastService.info({
          message: `${account} account set as default`,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  getDefaultAccount() {
    try {
      const accountParams = this.activatedRoute.snapshot.queryParams['account'];
      if (accountParams) {
        const accountParamsId = parseInt(accountParams);
        const index =
          accountParamsId > 0 && accountParamsId <= this.accountTypes.length
            ? accountParamsId - 1
            : 0;

        return this.accountTypes[index];
      } else {
        return localStorage.getItem('defaultAccount') as AccountType;
      }
    } catch (err) {
      console.log(err);
      return this.accountTypes[0];
    }
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }
}
