import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, shareReplay, Subscription, switchMap } from 'rxjs';
import { BookmarkService } from 'src/app/core/service/bookmark.service';
import { FileService } from 'src/app/core/service/file.service';
import { SidebarService } from 'src/app/core/service/sidebar.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import { getUpdownLabel } from 'src/app/modules/projection/utils/shared-utils';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { sidebarLeftAnimationSlide } from 'src/app/shared/utils/sidebar-left-animation';
import { Operation } from '../../model/operation';
import { OperationFilterService } from '../../service/operation-filter.service';
import { OperationService } from '../../service/operation.service';
import { getRevenueColorClass } from '../../utils/shared-utils';
@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
  animations: [
    trigger('sidebarLeftInOut', sidebarLeftAnimationSlide),
    trigger('slideAnimation', [
      state('left', style({ transform: 'translateX(-100%)' })),
      state('center', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(100%)' })),
      transition('left => center', [animate('300ms ease-in')]),
      transition('center => left', [animate('300ms ease-out')]),
      transition('right => center', [animate('300ms ease-in')]),
      transition('center => right', [animate('300ms ease-out')]),
    ]),
  ],
})
export class ViewChartComponent implements OnDestroy {
  private fileService = inject(FileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private operationService = inject(OperationService);
  private sidebarService = inject(SidebarService);
  private toastService = inject(ToastService);
  private operationFilter = inject(OperationFilterService);
  private bookmarkService = inject(BookmarkService);
  private operationCommentService = inject(OperationCommentService);

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (
      this.activatedRoute.snapshot.children.at(0)?.routeConfig?.path === 'edit'
    )
      return;
    event.stopPropagation();
    if (event.key === 'ArrowLeft') {
      this.navigatePreviousOperation();
    } else if (event.key === 'ArrowRight') {
      this.navigateNextOperation();
    }
  }

  getUpdownLabel = getUpdownLabel;
  getRevenueColorClass = getRevenueColorClass;

  operations: Operation[] = [];
  filteredOperations$ = this.operationFilter.getFilteredOperations(
    this.operationService.operations$.pipe(shareReplay(1)),
  );
  operationsWithChart$ = this.filteredOperations$.pipe(
    map((operations) => operations.filter((operation) => operation.graph)),
  );
  operationSubscription = this.operationsWithChart$.subscribe((operations) => {
    this.operations = operations.reverse();
    this.navigationIndex = this.getNavigationIndex();
  });

  operation$ = this.activatedRoute.params.pipe(
    switchMap((params) => {
      const id = params['id'];
      return this.operationService.getOperation(id);
    }),
  );

  comments$ = this.activatedRoute.params.pipe(
    switchMap((params) => {
      const id = params['id'];
      return this.operationCommentService.getCommentsById(id);
    }),
  );

  navigationIndex!: number;
  imageUrl?: SafeUrl;
  isLoading!: boolean;
  slideState = 'center';

  sidebarLeftState$ = this.sidebarService.sidebarLeftState$;

  private image$ = combineLatest([
    this.activatedRoute.params,
    this.operationsWithChart$,
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
        this.isLoading = true;
        this.fileService.getImage(fileName).then((url) => {
          if (url) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
            this.isLoading = false;
          }
        });
      }
    },
  );

  // MNavigate to more recent
  navigatePreviousOperation() {
    if (this.navigationIndex < this.operations.length - 1) {
      this.slideState = 'left';

      this.navigationIndex++;
      const id = this.operations[this.navigationIndex].id;
      this.navigateToOperation(id);

      setTimeout(() => (this.slideState = 'center'), 300);
    } else {
      this.toastService.info({
        message: 'No previous operation',
        duration: 1500,
      });
    }
  }

  // Navigate to older
  navigateNextOperation() {
    if (this.navigationIndex > 0) {
      this.slideState = 'right';

      this.navigationIndex--;
      const id = this.operations[this.navigationIndex].id;
      this.navigateToOperation(id);

      setTimeout(() => (this.slideState = 'center'), 300);
    } else {
      this.toastService.info({
        message: 'No further operation',
        duration: 1500,
      });
    }
  }

  navigateToOperation(operationId: number) {
    navigatePreservingQueryParams(
      ['../' + operationId],
      this.router,
      this.activatedRoute,
    );
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

  setBookmark() {
    this.bookmarkService.setBookmark(false, this.router.url);
  }

  ngOnDestroy() {
    this.operationSubscription.unsubscribe();
    this.imageSubscription.unsubscribe();
  }
}
