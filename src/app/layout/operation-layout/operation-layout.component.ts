import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/core/service/account.service';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-operation-layout',
  templateUrl: './operation-layout.component.html',
})
export class OperationLayoutComponent {
  private operationService = inject(OperationService);
  accountService = inject(AccountService);

  private accountSubscription!: Subscription;

  constructor(opcommentService: OperationCommentService) {
    opcommentService.getComments().subscribe(); //caching purposes

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

  title = MainLayoutComponent.title;
  buttons = MainLayoutComponent.buttons;

  get isDefaultAccount() {
    return this.accountService.isDefaultAccount();
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }
}
