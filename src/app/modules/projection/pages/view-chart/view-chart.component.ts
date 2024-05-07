import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Subscription, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../model/projection';
import { ProjectionFilterService } from '../../service/projection-filter.service';
import { ProjectionService } from '../../service/projection.service';

@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
})
export class ViewChartComponent {
  private projectionService = inject(ProjectionService);
  private fileService = inject(FileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private toastService = inject(ToastService);
  private projectionFilter = inject(ProjectionFilterService);

  projections: Projection[] = [];
  filteredProjections$ = this.projectionFilter.getFilteredProjections(
    this.projectionService.projections$,
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

  navigationIndex!: number;
  imageUrl?: SafeUrl;
  isLoading!: boolean;

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

  navigatePreviousProjection() {
    if (this.navigationIndex > 0) {
      this.navigationIndex--;
      const id = this.projections[this.navigationIndex].id;
      this.navigateToProjection(id);
    } else {
      this.toastService.warn({
        message: 'No previous projection',
        duration: 1500,
      });
    }
  }

  navigateNextProjection() {
    if (this.navigationIndex < this.projections.length - 1) {
      this.navigationIndex++;
      const id = this.projections[this.navigationIndex].id;
      this.navigateToProjection(id);
    } else {
      this.toastService.warn({
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

  private getNavigationIndex() {
    const paramId = parseInt(this.activatedRoute.snapshot.params['id']);
    const item = this.projections.find(
      (projection) => projection.id === paramId,
    );

    return this.projections.indexOf(item!);
  }

  ngOnDestroy() {
    this.imageSubscription?.unsubscribe();
    this.projectionSubscription?.unsubscribe();
  }
}
