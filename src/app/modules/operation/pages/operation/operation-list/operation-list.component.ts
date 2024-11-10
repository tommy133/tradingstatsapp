import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, shareReplay } from 'rxjs';
import { BookmarkService } from 'src/app/core/service/bookmark.service';
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
  private toastService = inject(ToastService);
  private operationFilterService = inject(OperationFilterService);
  private operationFilterFormService = inject(OperationFilterFormService);
  private bookmarkService = inject(BookmarkService);

  private operations$ = this.operationService.operations$.pipe(shareReplay(1));
  searchOperationsControl = new FormControl<string>('');
  private searchOperations$ = this.formService.applyDebounceOnSearch(
    this.searchOperationsControl.valueChanges,
  );
  isSearchActive$ = this.searchOperationsControl.valueChanges.pipe(
    map((search) => (search?.length ?? 0) > 0),
  );

  private filteredOperationsByName$ = this.formService.filterItems(
    this.operations$,
    this.searchOperations$,
    ({ symbol }) => symbol.name_sym,
  );

  private filteredOperations$ =
    this.operationFilterService.getFilteredOperations(
      this.filteredOperationsByName$,
    );

  orderBySelect = new FormControl<string>('');
  ngAfterViewInit() {
    this.orderBySelect.setValue('Inserted at');
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
      if (orderBy === 'Inserted at') {
        const unsortedOperations = [...operations];
        return unsortedOperations.sort(
          (b, a) =>
            new Date(a.inserted_at).getTime() -
            new Date(b.inserted_at).getTime(),
        );
      }

      return operations; //assume it comes already sorted by dateOpen from backend
    }),
  );

  n_operations$ = this.filteredOperations$.pipe(map((ops) => ops.length));

  goToChecklist() {
    navigatePreservingQueryParams(
      ['checklist'],
      this.router,
      this.activatedRoute,
    );
  }

  goToBookmark() {
    const bookmark = this.bookmarkService.getBookmark(false);

    if (bookmark) {
      this.router.navigateByUrl(bookmark);
    } else {
      this.toastService.info({
        message: 'No bookmark available',
      });
    }
  }

  goToRules() {
    navigatePreservingQueryParams(['rules'], this.router, this.activatedRoute);
  }

  onDeleteOperation(operation: Operation): void {
    this.operationService.deleteOperation(operation);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }

  resetFilterForm() {
    this.operationFilterFormService.resetForm();
  }
}
