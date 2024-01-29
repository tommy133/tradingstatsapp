import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Operation } from '../../../model/operation';
import { OperationService } from '../../../service/operation.service';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
})
export class OperationListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);
  private formService = inject(FormService);
  private fileService = inject(FileService);

  operations$ = this.operationService.operations$;
  searchOperationsControl = new FormControl<string>('');
  searchOperations$ = this.formService.applyDebounceOnSearch(
    this.searchOperationsControl.valueChanges,
  );
  filteredOperationsByName$ = this.formService.filterItems(
    this.operations$,
    this.searchOperations$,
    ({ symbol }) => symbol.name_sym,
  );

  filteredOperations$ = this.operationService.filterOperationsByPeriod(
    this.filteredOperationsByName$,
  );

  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  public onDeleteOperation(operation: Operation): void {
    const { id, graph } = operation;
    if (graph) {
      this.fileService.deleteImage(graph);
    }
    this.operationService.deleteOperation(id);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }
}
