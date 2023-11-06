import { inject, Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private storage = inject(Storage);
  private readonly IMG_DIR = 'images';

  async getImage(imgName: string) {
    const imageRef = ref(this.storage, `${this.IMG_DIR}/${imgName}`);

    try {
      const downloadURL = await getDownloadURL(imageRef);

      return downloadURL;
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  }
}
