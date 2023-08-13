import { trigger } from '@angular/animations';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/core/service/form.service';
import { RoutingService } from 'src/app/core/service/routing.service';
import {
  SidebarRightAnimationState,
  sidebarRightAnimationSlide,
} from 'src/app/shared/utils/sidebar-right-animation';
import { OperationService } from '../../../service/operation.service';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  animations: [trigger('sidebarRightInOut', sidebarRightAnimationSlide)],
})
export class OperationListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private routingService = inject(RoutingService);
  private operationService = inject(OperationService);
  private formService = inject(FormService);

  operations$ = this.operationService.operations$;
  searchOperationsControl = new FormControl<string>('');
  searchOperations$ = this.formService.applyDebounceOnSearch(
    this.searchOperationsControl.valueChanges,
  );
  filteredOperations$ = this.formService.filterItems(
    this.operations$,
    this.searchOperations$,
    ({ symbol }) => symbol.name_sym,
  );

  sidebarRightAnimationState: SidebarRightAnimationState = 'out';

  ngOnInit() {
    this.operationService.setRefetchInterval();
  }

  goToAdd() {
    this.routingService.navigatePreservingQueryParams(
      ['add'],
      this.router,
      this.activatedRoute,
    );
  }

  public onDeleteOperation(operationId: number): void {
    this.operationService.deleteOperation(operationId);
  }
}
