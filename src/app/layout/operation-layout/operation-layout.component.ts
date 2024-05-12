import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/core/service/account.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
import { NavButton } from 'src/app/shared/utils/custom-types';

@Component({
  selector: 'app-operation-layout',
  templateUrl: './operation-layout.component.html',
})
export class OperationLayoutComponent {
  private operationService = inject(OperationService);
  accountService = inject(AccountService);

  private accountSubscription!: Subscription;

  constructor() {
    this.accountService.initializeAccountControl(
      inject(ActivatedRoute).snapshot,
    );
    this.accountSubscription =
      this.accountService.accountControl.valueChanges.subscribe((account) => {
        if (account) {
          this.accountService.switchAccount(account);
          this.operationService.refetch();
        }
      });
  }

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

  get isDefaultAccount() {
    return this.accountService.isDefaultAccount();
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }
}
