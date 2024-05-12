import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { AccountType } from 'src/app/shared/utils/custom-types';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  defaultAccount: WritableSignal<AccountType | null> = signal(
    this.getDefaultAccount() ?? null,
  );

  initializeAccountControl(snapshot: ActivatedRouteSnapshot) {
    this.accountControl = this.formBuilder.control<AccountType>(
      this.getInitialAccount(snapshot) ?? 'Demo',
    );
  }

  accountTypes: AccountType[] = ['Demo', 'Live', 'Backtest'];

  accountControl!: FormControl<AccountType | null>;

  isDefaultAccount() {
    const defaultAccount = this.defaultAccount();
    if (defaultAccount) {
      const currentAccount =
        this.activatedRoute.snapshot.queryParams['account'];
      const defaultAccountIndex = this.accountTypes.indexOf(defaultAccount) + 1;

      return parseInt(currentAccount) === defaultAccountIndex;
    }
    return false;
  }

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

  setDefaultAccount() {
    const account = this.accountControl.value;
    if (account) {
      try {
        localStorage.setItem('defaultAccount', account);
        this.defaultAccount.set(account);
        this.toastService.info({
          message: `${account} account set as default`,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  deleteDefaultAccount() {
    const account = this.accountControl.value;
    if (account) {
      try {
        localStorage.removeItem('defaultAccount');
        this.defaultAccount.set(null);
        this.toastService.info({
          message: `${account} deleted as default`,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  getInitialAccount(snapshot: ActivatedRouteSnapshot) {
    const accountParams = snapshot.queryParams['account'];
    if (accountParams) {
      const accountParamsId = parseInt(accountParams);
      const index =
        accountParamsId > 0 && accountParamsId <= this.accountTypes.length
          ? accountParamsId - 1
          : 0;
      return this.accountTypes[index];
    } else {
      return this.defaultAccount();
    }
  }

  private getDefaultAccount() {
    try {
      return localStorage.getItem('defaultAccount') as AccountType | null;
    } catch (err) {
      console.log(err);
      return this.accountTypes[0];
    }
  }
}
