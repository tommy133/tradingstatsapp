import { Component, inject } from '@angular/core';
import { AccountService } from 'src/app/core/service/account.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';

@Component({
  selector: 'app-stats-layout',
  templateUrl: './stats-layout.component.html',
})
export class StatsLayoutComponent {
  private operationService = inject(OperationService);
  accountService = inject(AccountService);

  title: string = 'Trading Stats';
  buttons = [
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

  accountTypes = this.accountService.accountTypes;

  private accountSubscription =
    this.accountService.accountControl.valueChanges.subscribe((account) => {
      if (account) {
        this.accountService.switchAccount(account);
        this.operationService.refetch();
      }
    });

  get isDefaultAccount() {
    return this.accountService.isDefaultAccount();
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }
}
