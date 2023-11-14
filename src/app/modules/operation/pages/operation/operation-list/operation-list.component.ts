import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  filteredOperations$ = this.formService.filterItems(
    this.operations$,
    this.searchOperations$,
    ({ symbol }) => symbol.name_sym,
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
    this.router.navigate(['.'], { relativeTo: this.activatedRoute });
  }
}
