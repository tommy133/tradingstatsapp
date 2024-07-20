import { Component } from '@angular/core';

@Component({
  selector: 'app-averages',
  template: `
    <div>
      <app-label
        bgColor="bg-dark"
        textColor="text-white"
        styles="inline-flex items-center justify-center rounded-md p-10 font-semibold text-sm"
      >
        <div class="flex flex-col space-y-10">
          <p class="font-semibold text-base">Averages</p>
          <app-label> </app-label>
        </div>
      </app-label>
    </div>
  `,
})
export class AveragesComponent {}
