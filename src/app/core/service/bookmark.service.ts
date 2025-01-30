import { inject, Injectable } from '@angular/core';
import { firstValueFrom, shareReplay } from 'rxjs';
import { ToastService } from './toast.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  currentUser$ = this.userService.currentUser().pipe(shareReplay(1));

  public async setBookmark(projection: boolean, id: number) {
    try {
      if (id) {
        const user = await firstValueFrom(this.currentUser$);
        if (projection) {
          user.proj_bm = id;
        } else {
          user.op_bm = id;
        }
        const res = await firstValueFrom(this.userService.updateUser(user));
        if (res)
          this.toastService.success({
            message: `Current ${
              projection ? 'projection' : 'operation'
            } set as bookmark`,
          });
      } else {
        this.toastService.error({
          message: 'Error with id',
        });
      }
    } catch (err) {
      console.error(err);
      this.toastService.error({
        message: 'Error setting bookmark',
      });
    }
  }

  public async getBookmark(projection: boolean) {
    try {
      const user = await firstValueFrom(this.currentUser$);

      return projection ? user.proj_bm : user.op_bm;
    } catch (err) {
      console.error(err);
      this.toastService.error({
        message: 'Error getting bookmark',
      });
      return null;
    }
  }
}
