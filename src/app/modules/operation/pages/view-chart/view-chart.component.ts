import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ITradingViewWidget } from 'angular-tradingview-widget';
import { Observable, Subscription } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { FileService } from 'src/app/file.service';
import { Projection } from 'src/app/modules/projection/model/projection';
@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
})
export class ViewChartComponent implements OnInit {
  projection$?: Observable<Projection>;
  fileSubscription?: Subscription;
  imageUrl?: SafeUrl;
  widgetConfig: ITradingViewWidget = {
    symbol: 'EURUSD',
    widgetType: 'widget',
  };
  constructor(
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    const filename = this.activatedRoute.snapshot.queryParamMap.get('fileName');

    if (filename) {
      this.downloadFile(filename);
    }
  }

  private downloadFile(filename: string) {
    this.fileService.downloadFile(filename).subscribe(
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
}
