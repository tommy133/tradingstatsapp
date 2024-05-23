import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-rules',
  template: `
      <app-back-to
      class="top-5"
      backText="BACK TO OPERATIONS"
      backTo=".."></app-back-to>
  <div
    class="flex flex-col h-full justify-center items-center whitespace-pre">
    <textarea
      class="font-semibold rounded-md no-scrollbar p-4"
      rows="20"
      cols="100">
    {{ rules }}
  </textarea>
  </div> `,
})
export class RulesComponent implements OnInit {
  constructor(private httpClient: HttpClient) { }

  rules: string = '';

  async ngOnInit() {
    this.rules = await firstValueFrom(
      this.httpClient.get('assets/rules.txt', { responseType: 'text' }),
    );
  }
}
