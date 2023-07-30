import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormService } from 'src/app/core/service/form.service';
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

  constructor(
    private operationService: OperationService,
    private formService: FormService,
  ) {}

  ngOnInit() {
    this.operationService.setRefetchInterval();
  }

  public onDeleteOperation(operationId: number): void {
    this.operationService.deleteOperation(operationId);
  }
}
