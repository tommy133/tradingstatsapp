import { inject, Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private storage = inject(Storage);
  private readonly IMG_DIR = 'images';

  public uploadImage(file: File) {
    const imgRef = ref(this.storage, `${this.IMG_DIR}/${file.name}`);

    uploadBytes(imgRef, file).catch((error) => console.error(error));
  }

  public async getImage(imgName: string) {
    const imageRef = ref(this.storage, `${this.IMG_DIR}/${imgName}`);

    try {
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  }

  public async deleteImage(imgName: string) {
    const imageRef = ref(this.storage, `${this.IMG_DIR}/${imgName}`);

    try {
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
}
