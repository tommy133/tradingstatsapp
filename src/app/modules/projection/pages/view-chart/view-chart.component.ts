import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, map, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { ProjectionService } from '../../service/projection.service';

type Interval =
  | '1'
  | '3'
  | '5'
  | '15'
  | '30'
  | '60'
  | '120'
  | '180'
  | IntervalTypes.D
  | IntervalTypes.W;

enum IntervalTypes {
  D = 'D',
  W = 'W',
}

enum Themes {
  LIGHT = 'Light',
  DARK = 'Dark',
}

@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
})
export class ViewChartComponent {
  projectionSubscription?: Subscription;
  imageUrl?: SafeUrl;
  isLoading!: boolean;

  backToQueryParams: { [key: string]: any } = {};

  constructor(
    private projectionService: ProjectionService,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.isLoading = true;

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
    this.projectionService.projections$,
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
        this.fileService.getImage(fileName).then((url) => {
          if (url) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
            this.isLoading = false;
          }
        });
      }
    },
  );

  //Widget deaprecated

  // ngOnInit() {
  // const intervalMapping: Record<string, Interval> = {
  //   M1: '1',
  //   M3: '3',
  //   M5: '5',
  //   M15: '15',
  //   M30: '30',
  //   H1: '60',
  //   H2: '120',
  //   H3: '180',
  //   D: IntervalTypes.D,
  //   W: IntervalTypes.W,
  // };
  // this.projection$.subscribe((projection) => {
  //   this.widgetConfig = {
  //     symbol: projection.symbol.name_sym,
  //     interval: intervalMapping[projection.timeframe],
  //     theme: Themes.DARK,
  //     widgetType: 'widget',
  //   };
  // });
  // }

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

  ngOnDestroy() {
    this.imageSubscription?.unsubscribe();
    this.projectionSubscription?.unsubscribe();
  }
}
