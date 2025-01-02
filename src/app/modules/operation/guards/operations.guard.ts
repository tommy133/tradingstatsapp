import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AccountService } from 'src/app/core/service/account.service';

@Injectable({
  providedIn: 'root',
})
export class OperationsGuard implements CanActivate {
  private accountService = inject(AccountService);
  private router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let year = next.queryParamMap.get('year');
    let account = next.queryParamMap.get('account');

    if (year && account) return true;
    if (!year) year = this.getInitialYear();
    if (!account)
      account = (
        this.accountService.accountTypes.indexOf(
          this.accountService.defaultAccount() ?? 'Demo',
        ) + 1
      ).toString();

    //redirect Ok route
    let route: string = '';
    if (state.url.includes('checklist')) {
      route = state.url.split('?')[0];
    } else {
      route = 'operations';
    }

    this.router.navigate([route], {
      queryParams: {
        account: account,
        year: year,
      },
    });

    return false;
  }

  getInitialYear() {
    const initialYear = new Date().getFullYear().toString();
    return initialYear;
  }
}
