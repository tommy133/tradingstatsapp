import { trigger } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Subscription } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { SidebarService } from 'src/app/core/service/sidebar.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { sidebarLeftAnimationSlide } from 'src/app/shared/utils/sidebar-left-animation';
import { Operation } from '../../model/operation';
import { OperationService } from '../../service/operation.service';
@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
  animations: [trigger('sidebarLeftInOut', sidebarLeftAnimationSlide)],
})
export class ViewChartComponent implements OnInit, OnDestroy {
  private fileService = inject(FileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private toastService = inject(ToastService);
  private operationService = inject(OperationService);
  private sidebarService = inject(SidebarService);

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
  // widgetConfig: ITradingViewWidget = {
  //   symbol: 'EURUSD',
  //   widgetType: 'widget',
  // };

  sidebarLeftState$ = this.sidebarService.sidebarLeftState$;

  ngOnInit() {
    this.sidebarService.openSidebarLeft(); //default open
  }

  private image$ = combineLatest([
    this.activatedRoute.params,
    this.operationService.operations$,
  ]).pipe(
    map(([params, operations]) => {
      const fileName = operations.find(
        (operation) => operation.id === parseInt(params['id']),
      )?.graph;
      return fileName;
    }),
  );

  private imageSubscription: Subscription = this.image$.subscribe(
    (fileName) => {
      if (fileName) {
        this.fileService.getImage(fileName).then((url) => {
          if (url) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
          }
        });
      }
    },
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

  openSidebarLeft() {
    this.sidebarService.openSidebarLeft();
  }

  closeSidebarLeft() {
    this.sidebarService.closeSidebarLeft();
  }

  private getNavigationIndex() {
    const paramId = parseInt(this.activatedRoute.snapshot.params['id']);
    const item = this.operations.find((operation) => operation.id === paramId);

    return this.operations.indexOf(item!);
  }

  ngOnDestroy() {
    this.operationSubscription.unsubscribe();
    this.imageSubscription.unsubscribe();
  }
}
