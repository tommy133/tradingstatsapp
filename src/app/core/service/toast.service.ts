import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastOptions {
  type?: 'success' | 'error'; // Use your declaration
  duration?: number;
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toast = new Subject<ToastOptions | null>();
  private readonly DEFAULT_TIMEOUT = 3000;
  private pendingTimeout = false;
  private timeoutId?: number;
  toast$ = this.toast.asObservable();

  private showToast({
    title = '',
    type = 'success',
    message = '',
    duration = this.DEFAULT_TIMEOUT,
  }: ToastOptions) {
    if (this.pendingTimeout) {
      clearTimeout(this.timeoutId);
      this.pendingTimeout = false;
    }
    this.toast.next({ title, message, type });
    const timeOut = window.setTimeout(() => {
      this.toast.next(null);
    }, duration);
    this.pendingTimeout = true;
    this.timeoutId = timeOut;
  }

  public success({ title = 'Success', ...restOfOptions }: ToastOptions) {
    this.showToast({ type: 'success', ...restOfOptions });
  }

  public error({
    title = 'An error has occured',
    ...restOfOptions
  }: ToastOptions) {
    this.showToast({ type: 'error', title, ...restOfOptions });
  }
}
