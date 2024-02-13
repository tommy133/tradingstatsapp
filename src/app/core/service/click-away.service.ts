import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClickAwayService {
  private clickedInside = {
    filters: false,
  };

  clickInside(key: keyof typeof this.clickedInside) {
    this.clickedInside[key] = true;
  }

  clickOut(key: keyof typeof this.clickedInside) {
    const result = !this.clickedInside[key];
    this.clickedInside[key] = false;
    return result;
  }
}
