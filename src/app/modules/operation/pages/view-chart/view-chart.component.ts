import { trigger } from '@angular/animations';
import { Component, OnDestroy, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ITradingViewWidget } from 'angular-tradingview-widget';
import { combineLatest, map, switchMap } from 'rxjs';
import { SidebarRightService } from 'src/app/core/service/sidebar-right.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { FileService } from 'src/app/file.service';
import { sidebarRightAnimationSlide } from 'src/app/shared/utils/sidebar-right-animation';
import { Operation } from '../../model/operation';
import { OperationService } from '../../service/operation.service';
@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
  animations: [trigger('sidebarRightInOut', sidebarRightAnimationSlide)],
})
export class ViewChartComponent implements OnDestroy {
  private fileService = inject(FileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private toastService = inject(ToastService);
  private operationService = inject(OperationService);
  private sidebarRightService = inject(SidebarRightService);

  operations: Operation[] = [];
  operationsWithChart$ = this.operationService.operations$.pipe(
    map((operations) => operations.filter((operation) => operation.graph)),
  );
  operationSubscription = this.operationsWithChart$.subscribe((operations) => {
    this.operations = operations;
    this.navigationIndex = this.getNavigationIndex();
  });
  navigationIndex!: number;

  imageUrl?: SafeUrl;
  widgetConfig: ITradingViewWidget = {
    symbol: 'EURUSD',
    widgetType: 'widget',
  };

  sidebarRightState$ = this.sidebarRightService.sidebarRightState$;

  imageUrl$ = combineLatest([
    this.activatedRoute.params,
    this.operationService.operations$,
  ]).pipe(
    switchMap(([params, operations]) => {
      const fileName = operations.find(
        (operation) => operation.id === parseInt(params['id']),
      )?.graph;
      return this.fileService.downloadFile(fileName!).pipe(
        map((data) => {
          const blob = new Blob([data], { type: 'image/png' });
          return this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(blob),
          );
        }),
      );
    }),
  );

  navigatePreviousOperation() {
    if (this.navigationIndex > 0) {
      this.navigationIndex--;
      const id = this.operations[this.navigationIndex].id;
      this.navigateToOperation(id);
    }
  }

  navigateNextOperation() {
    if (this.navigationIndex < this.operations.length - 1) {
      this.navigationIndex++;
      const id = this.operations[this.navigationIndex].id;
      this.navigateToOperation(id);
    }
  }

  navigateToOperation(operationId: number) {
    this.router.navigate(['../' + operationId], {
      relativeTo: this.activatedRoute,
    });
  }

  openSidebarRight() {
    this.sidebarRightService.openSidebarRight();
  }

  private getNavigationIndex() {
    const paramId = parseInt(this.activatedRoute.snapshot.params['id']);
    const item = this.operations.find((operation) => operation.id === paramId);

    return this.operations.indexOf(item!);
  }

  ngOnDestroy() {
    this.operationSubscription.unsubscribe();
  }
}
