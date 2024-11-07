import { inject, Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private toastService = inject(ToastService);

  public setBookmark(projection: boolean, url: string) {
    try {
      if (url) {
        const bookmarkKey = projection
          ? 'bookmarkProjection'
          : 'bookmarkOperation';
        localStorage.setItem(bookmarkKey, url);
        this.toastService.success({
          message: `Current ${
            projection ? 'projection' : 'operation'
          } set as bookmark`,
        });
      } else {
        this.toastService.error({
          message: 'Error with url',
        });
      }
    } catch (err) {
      console.error(err);
      this.toastService.error({
        message: 'Error setting bookmark',
      });
    }
  }

  public getBookmark(projection: boolean) {
    try {
      return localStorage.getItem(
        projection ? 'bookmarkProjection' : 'bookmarkOperation',
      );
    } catch (err) {
      console.error(err);
      this.toastService.error({
        message: 'Error getting bookmark',
      });
      return null;
    }
  }
}
