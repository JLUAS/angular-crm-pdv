import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticateUser, UserLogin, UserRegister, UserTable, UserTableEdit } from '../models/User'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'https://node-pdv.onrender.com/users';
  // private apiUrl = 'https://humorous-oryx-ace.ngrok-free.app';

  constructor(private http: HttpClient, private router: Router) { }

  hasTokenAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const rol = localStorage.getItem('rol');
      return rol === 'admin';
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  hasTokenRoot(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const rol = localStorage.getItem('rol');
      return rol === 'root';
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  hasTokenUser(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const rol = localStorage.getItem('rol');
      return rol === 'user';
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  login(user: UserLogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  register(user: UserRegister): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  isAuthenticated(email:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/isAuthenticated`, {email});
  }

  authenticateUser(user:AuthenticateUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticateUser`, user);
  }

  sendEmail(user:AuthenticateUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/send-email`, user);
  }

  getUsers():Observable<any>{
      return this.http.get(`${this.apiUrl}/getUsers/admin/`);
  }

  editUser(user:UserTable): Observable<any> {
    return this.http.post(`${this.apiUrl}/editUser/admin`, user);
  }

  deleteUser(user: UserTable): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/admin`, {body: user});
  }


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
