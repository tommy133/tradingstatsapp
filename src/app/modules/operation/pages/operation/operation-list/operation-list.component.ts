import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Operation } from '../../../model/operation';
import { OperationFilterFormService } from '../../../service/operation-filter-form.service';
import { OperationFilterService } from '../../../service/operation-filter.service';
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
  private toastService = inject(ToastService);
  private operationFilterService = inject(OperationFilterService);
  private operationFilterFormService = inject(OperationFilterFormService);

  operations$ = this.operationService.operations$;
  searchOperationsControl = new FormControl<string>('');
  searchOperations$ = this.formService.applyDebounceOnSearch(
    this.searchOperationsControl.valueChanges,
  );
  isSearchActive$ = this.searchOperationsControl.valueChanges.pipe(
    map((search) => (search?.length ?? 0) > 0),
  );

  filteredOperationsByName$ = this.formService.filterItems(
    this.operations$,
    this.searchOperations$,
    ({ symbol }) => symbol.name_sym,
  );

  filteredOperations$ = this.operationFilterService.getFilteredOperations(
    this.filteredOperationsByName$,
  );

  n_operations$ = this.filteredOperations$.pipe(map((ops) => ops.length));

  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  goToBookmark() {
    const bookmark = this.getBookmark();

    if (bookmark) {
      this.router.navigateByUrl(bookmark);
    } else {
      this.toastService.warn({
        message: 'No bookmark available',
      });
    }
  }

  goToRules() {
    navigatePreservingQueryParams(['rules'], this.router, this.activatedRoute);
  }

  onDeleteOperation(operation: Operation): void {
    const { id, graph } = operation;
    if (graph) {
      this.fileService.deleteImage(graph);
    }
    this.operationService.deleteOperation(id);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }

  private getBookmark() {
    try {
      return localStorage.getItem('bookmarkOperation');
    } catch (err) {
      this.toastService.error({
        message: 'Error getting bookmark',
      });
      return null;
    }
  }

  resetFilterForm() {
    this.operationFilterFormService.resetForm();
  }
}
