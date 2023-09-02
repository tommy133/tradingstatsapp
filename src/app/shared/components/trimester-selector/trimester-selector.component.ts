import { Component } from '@angular/core';

@Component({
  selector: 'app-trimester-selector',
  template: `<div class="flex flex-row space-x-4">
    <button class="square-btn  bg-gray-300">
      <h5 class="text-black">Q1</h5>
    </button>
    <button class="square-btn bg-dark">
      <h5 class="text-white">Q2</h5>
    </button>
    <button class="square-btn bg-dark">
      <h5 class="text-white">Q3</h5>
    </button>
    <button class="square-btn bg-dark">
      <h5 class="text-white">Q4</h5>
    </button>
  </div> `,
})
export class TrimesterSelectorComponent {}
