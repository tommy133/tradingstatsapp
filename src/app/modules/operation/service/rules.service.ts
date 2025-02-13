import { inject, Injectable } from '@angular/core';
import { FileService } from 'src/app/core/service/file.service';
@Injectable({
  providedIn: 'root',
})
export class RulesService {
  private readonly fileService = inject(FileService);

  async getRules() {
    const fileMetadata = await this.fileService.getFile('rules.txt', '');
    const fileContent = await this.fileService.downloadFile(fileMetadata ?? '');
    return fileContent;
  }

  updateRules(newRules: string) {
    const blob = new Blob([newRules], { type: 'text/plain' });
    const file = new File([blob], 'rules.txt', { type: 'text/plain' });
    this.fileService.uploadFile(file, '');
  }
}
