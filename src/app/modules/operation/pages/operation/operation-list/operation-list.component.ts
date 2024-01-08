import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { RoutingService } from 'src/app/core/service/routing.service';
import { Operation } from '../../../model/operation';
import { OperationService } from '../../../service/operation.service';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
})
export class OperationListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private routingService = inject(RoutingService);
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

  filteredOperationsByTrimester$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => ({
      q1: quarters['q1'] === 'true',
      q2: quarters['q2'] === 'true',
      q3: quarters['q3'] === 'true',
      q4: quarters['q4'] === 'true',
    })),
  );

  year$ = this.activatedRoute.queryParams.pipe(
    map((queryParams) => queryParams['year']),
  );

  filteredOperations$ = combineLatest([
    this.filteredOperationsByName$,
    this.filteredOperationsByTrimester$,
    this.year$,
  ]).pipe(
    map(([operations, quarters, year]) => {
      return operations.filter((operation) => {
        if (operation.dateOpen) {
          const operationDate = new Date(operation.dateOpen);
          const quarter = Math.floor(operationDate.getMonth() / 3) + 1;
          return (
            (quarters as { [key: string]: boolean })[`q${quarter}`] &&
            operationDate.getFullYear() == year
          );
        }
        return false;
      });
    }),
  );

  goToAdd() {
    this.routingService.navigatePreservingQueryParams(
      ['add'],
      this.router,
      this.activatedRoute,
    );
  }

  public onDeleteOperation(operation: Operation): void {
    const { id, graph } = operation;
    if (graph) {
      this.fileService.deleteImage(graph);
    }
    this.operationService.deleteOperation(id);
  }

  onCloseSidebar() {
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve',
    });
  }
}
