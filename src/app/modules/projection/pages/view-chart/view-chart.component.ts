import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ITradingViewWidget } from 'angular-tradingview-widget';
import { Observable, Subscription, switchMap } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { FileService } from 'src/app/file.service';
import { Projection } from '../../model/projection';
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
export class ViewChartComponent implements OnInit {
  projection$?: Observable<Projection>;
  projectionSubscription?: Subscription;
  fileSubscription?: Subscription;
  imageUrl?: SafeUrl;
  widgetConfig!: ITradingViewWidget;

  constructor(
    private projectionService: ProjectionService,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.projection$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.projectionService.getProjection(id);
      }),
    );

    const intervalMapping: Record<string, Interval> = {
      M1: '1',
      M3: '3',
      M5: '5',
      M15: '15',
      M30: '30',
      H1: '60',
      H2: '120',
      H3: '180',
      D: IntervalTypes.D,
      W: IntervalTypes.W,
    };

    this.projection$.subscribe((projection) => {
      this.widgetConfig = {
        symbol: projection.symbol.name_sym,
        interval: intervalMapping[projection.timeframe],
        theme: Themes.DARK,
        widgetType: 'widget',
      };
    });

    const filename = this.activatedRoute.snapshot.queryParamMap.get('fileName');

    if (filename) {
      this.downloadFile(filename);
    }
  }

  private downloadFile(filename: string) {
    this.fileSubscription = this.fileService.downloadFile(filename).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'image/png' });
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(blob),
        );
      },
      (error) =>
        this.toastService.error({
          message: error,
        }),
    );
  }

  ngOnDestroy() {
    this.fileSubscription?.unsubscribe();
    this.projectionSubscription?.unsubscribe();
  }
}
