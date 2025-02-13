import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { firstValueFrom } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly toastService = inject(ToastService);
  private readonly storage = inject(Storage);
  private readonly http = inject(HttpClient);

  public static readonly IMG_DIR = 'images';

  public uploadFile(file: File, directory: string) {
    const fileRef = ref(this.storage, `${directory}/${file.name}`);

    uploadBytes(fileRef, file).catch((error) => {
      const errorMsg = 'Error uploading file:' + error;
      console.error(errorMsg);
      this.toastService.error({
        message: errorMsg,
      });
      return null;
    });
  }

  public async getFile(fileName: string, directory: string) {
    const fileRef = ref(this.storage, `${directory}/${fileName}`);

    try {
      return await getDownloadURL(fileRef);
    } catch (error) {
      const errorMsg = 'Error getting file:' + error;
      console.error(errorMsg);
      this.toastService.error({
        message: errorMsg,
      });
      return null;
    }
  }
  async downloadFile(downloadURL: string) {
    return firstValueFrom(this.http.get(downloadURL, { responseType: 'text' }));
  }

  public async deleteFile(fileName: string, directory: string) {
    const fileRef = ref(this.storage, `${directory}/${fileName}`);

    try {
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      const errorMsg = 'Error deleting file: ' + error;
      console.error(errorMsg);
      this.toastService.error({
        message: errorMsg,
      });
      return false;
    }
  }
}
