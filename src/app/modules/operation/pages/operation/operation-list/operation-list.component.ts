import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, shareReplay } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Operation } from '../../../model/operation';
import { OperationFilterFormService } from '../../../service/operation-filter-form.service';
import { OperationFilterService } from '../../../service/operation-filter.service';
import { OperationService } from '../../../service/operation.service';

const timeframeOrder: { [key: string]: number } = {
  M: 1,
  W: 2,
  D: 3,
  H4: 4,
  H1: 5,
  M30: 6,
  M15: 7,
  M5: 8,
  M1: 9,
};

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
})
export class OperationListComponent implements AfterViewInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);
  private formService = inject(FormService);
  private fileService = inject(FileService);
  private toastService = inject(ToastService);
  private operationFilterService = inject(OperationFilterService);
  private operationFilterFormService = inject(OperationFilterFormService);

  operations$ = this.operationService.operations$.pipe(shareReplay(1));
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

  orderBySelect = new FormControl<string>('');
  ngAfterViewInit() {
    this.orderBySelect.setValue('Date open');
  }

  orderedOperations$ = combineLatest([
    this.orderBySelect.valueChanges,
    this.filteredOperations$,
  ]).pipe(
    map(([orderBy, operations]) => {
      if (orderBy === 'Timeframe') {
        const unsortedOperations = [...operations];
        return unsortedOperations.sort(
          (a, b) => timeframeOrder[a.timeframe] - timeframeOrder[b.timeframe],
        );
      }

      return operations;
    }),
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
