import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticateUser, UserLogin, UserRegister, UserTable, UserTableEdit } from '../models/User'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'https://humorous-oryx-ace.ngrok-free.app/products';
  // private apiUrl = 'https://humorous-oryx-ace.ngrok-free.app'

  constructor(private http: HttpClient, private router: Router) { }

  addProduct(product:any): Observable<any> {
      return this.http.post(`${this.apiUrl}/addProduct`, product);
  }
  getProductHeaders():Observable<any>{
    return this.http.get(`${this.apiUrl}/getHeaders`);
  }
  getProducts():Observable<any>{
    return this.http.get(`${this.apiUrl}/getProducts`);
  }

  createCheckoutSession(product:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-checkout-session`, product);
}

}
