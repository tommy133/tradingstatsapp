import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  fileUploadUri = 'http://localhost:8080/file/upload';

  constructor(private http: HttpClient) {}

  public downloadFile(file: String) {
    let body = { filename: file };

    return this.http.post('http://localhost:8080/file/download', body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }
}
