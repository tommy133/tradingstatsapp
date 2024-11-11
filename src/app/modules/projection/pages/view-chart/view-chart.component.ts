import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostListener, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, shareReplay, Subscription, switchMap } from 'rxjs';
import { BookmarkService } from 'src/app/core/service/bookmark.service';
import { FileService } from 'src/app/core/service/file.service';
import { SidebarService } from 'src/app/core/service/sidebar.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import {
  navigatePreservingQueryParams,
  sortDataByInsertedAt,
} from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../model/projection';
import { ProjectionFilterService } from '../../service/projection-filter.service';
import { ProjectionService } from '../../service/projection.service';
import { getUpdownLabel } from '../../utils/shared-utils';

@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
  animations: [
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
export class ViewChartComponent {
  private projectionService = inject(ProjectionService);
  private fileService = inject(FileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private toastService = inject(ToastService);
  private projectionFilter = inject(ProjectionFilterService);
  private commentService = inject(ProjectionCommentService);
  private sidebarService = inject(SidebarService);
  private bookmarkService = inject(BookmarkService);

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (
      this.activatedRoute.snapshot.children.at(0)?.routeConfig?.path === 'edit'
    )
      return;
    event.stopPropagation();
    if (event.key === 'ArrowLeft') {
      this.navigatePreviousProjection();
    } else if (event.key === 'ArrowRight') {
      this.navigateNextProjection();
    }
  }

  getUpdownLabel = getUpdownLabel;

  projections: Projection[] = [];
  filteredProjections$ = this.projectionFilter.getFilteredProjections(
    this.projectionService.projections$.pipe(shareReplay(1)),
  );

  projectionsWithChart$ = this.filteredProjections$.pipe(
    map((projections) => projections.filter((projection) => projection.graph)),
  );
  projectionSubscription = this.projectionsWithChart$.subscribe(
    (projections) => {
      this.projections = projections.reverse();
      this.navigationIndex = this.getNavigationIndex();
    },
  );
  comments$ = this.activatedRoute.params.pipe(
    switchMap((params) => {
      const id = params['id'];
      return this.commentService.projectionComments$.pipe(
        map((res) => res.filter((comment) => comment.id_proj === Number(id))),
        map((filteredComments) => sortDataByInsertedAt(filteredComments)),
      );
    }),
  );

  navigationIndex!: number;
  imageUrl?: SafeUrl;
  isLoading!: boolean;
  slideState = 'center';

  sidebarLeftState$ = this.sidebarService.sidebarLeftState$;

  backToQueryParams: { [key: string]: any } = {};

  ngOnInit() {
    this.setBackToQueryParams();
  }

  projection$ = this.activatedRoute.params.pipe(
    switchMap((params) => {
      const id = params['id'];
      return this.projectionService.getProjection(id);
    }),
  );

  private image$ = combineLatest([
    this.activatedRoute.params,
    this.projectionsWithChart$,
  ]).pipe(
    map(([params, projections]) => {
      const fileName = projections.find(
        (projection) => projection.id === parseInt(params['id']),
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

  private setBackToQueryParams() {
    ['q1', 'q2', 'q3', 'q4'].forEach((quarter) => {
      if (this.activatedRoute.snapshot.queryParams[quarter]) {
        this.backToQueryParams[quarter] =
          this.activatedRoute.snapshot.queryParams[quarter];
      }
    });

    if (this.activatedRoute.snapshot.queryParams['year']) {
      this.backToQueryParams['year'] =
        this.activatedRoute.snapshot.queryParams['year'];
    }
  }

  // Navigate to more recent
  navigatePreviousProjection() {
    if (this.navigationIndex < this.projections.length - 1) {
      this.slideState = 'left';

      this.navigationIndex++;
      const id = this.projections[this.navigationIndex].id;
      this.navigateToProjection(id);

      setTimeout(() => (this.slideState = 'center'), 300);
    } else {
      this.toastService.info({
        message: 'No previous projection',
        duration: 1500,
      });
    }
  }

  // Navigate to older
  navigateNextProjection() {
    if (this.navigationIndex > 0) {
      this.slideState = 'right';

      this.navigationIndex--;
      const id = this.projections[this.navigationIndex].id;
      this.navigateToProjection(id);

      setTimeout(() => (this.slideState = 'center'), 300);
    } else {
      this.toastService.info({
        message: 'No further projection',
        duration: 1500,
      });
    }
  }

  navigateToProjection(projectionId: number) {
    navigatePreservingQueryParams(
      ['../' + projectionId],
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
    const item = this.projections.find(
      (projection) => projection.id === paramId,
    );

    return this.projections.indexOf(item!);
  }

  setBookmark() {
    this.bookmarkService.setBookmark(true, this.router.url);
  }

  ngOnDestroy() {
    this.imageSubscription?.unsubscribe();
    this.projectionSubscription?.unsubscribe();
  }
}
