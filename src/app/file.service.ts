import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  fileUploadUri = `${environment.apiBaseUrl}/file/upload`;
  fileDownloadUri = `${environment.apiBaseUrl}/file/download`;

  constructor(private http: HttpClient) {}

  public downloadFile(file: String) {
    let body = { filename: file };

    return this.http.post(this.fileDownloadUri, body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }
}
