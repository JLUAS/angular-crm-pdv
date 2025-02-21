import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  // private apiUrl = 'https://boutique-t9xx.onrender.com';
  private apiUrl = 'https://humorous-oryx-ace.ngrok-free.app/products';

  constructor(private http: HttpClient) {}

  downloadFile(name:any) {
    return this.http.get(`${this.apiUrl}/getImage/${name}`, {
      responseType: 'blob'  // Esto permite que Angular reciba el archivo como Blob
    });
  }
}
