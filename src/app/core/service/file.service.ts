import { inject, Injectable } from '@angular/core';
import {
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

    uploadBytes(imgRef, file)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  public async getImage(imgName: string) {
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
