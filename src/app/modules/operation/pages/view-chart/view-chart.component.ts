import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ITradingViewWidget } from 'angular-tradingview-widget';
import { FileService } from 'src/app/file.service';
@Component({
  selector: 'app-view-chart',
  template: `
    <div class="flex flex-row">
      <img class="w-1/3 h-1/2" [src]="imageUrl" alt="chart image" />
      <tradingview-widget [widgetConfig]="widgetConfig"></tradingview-widget>
    </div>
  `,
})
export class ViewChartComponent implements OnInit {
  imageUrl?: SafeUrl;
  widgetConfig: ITradingViewWidget = {
    symbol: 'EURUSD',
    widgetType: 'widget',
  };
  constructor(
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
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
      (error) => console.error(error),
    );
  }
}
