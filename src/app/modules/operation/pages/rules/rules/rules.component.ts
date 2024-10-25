import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';

@Component({
  selector: 'app-rules',
  template: `
    <app-back-to
      class="top-5"
      backText="BACK TO OPERATIONS"
      backTo=".."
    ></app-back-to>
    <div
      class="flex flex-col h-full justify-center items-center whitespace-pre"
    >
      <textarea
        class="font-semibold rounded-md no-scrollbar p-4"
        rows="20"
        cols="100"
      >
    {{ rules }}
  </textarea>
      <app-checklist />
    </div>
    <app-sidebar
      [sidebarState]="sidebarRight.isActivated ? 'in' : 'out'"
      (closeEvent)="onCloseSidebar()"
    >
      <ng-container right-content>
        <router-outlet #sidebarRight="outlet"></router-outlet>
      </ng-container>
    </app-sidebar>
  `,
})
export class RulesComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  rules: string = '';

  async ngOnInit() {
    this.rules = await firstValueFrom(
      this.httpClient.get('assets/rules.txt', { responseType: 'text' }),
    );
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }
}
