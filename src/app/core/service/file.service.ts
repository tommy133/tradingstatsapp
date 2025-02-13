import { inject, Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private toastService = inject(ToastService);
  private storage = inject(Storage);

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
