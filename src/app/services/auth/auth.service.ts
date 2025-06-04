import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://backend-child-development-tracker-production.up.railway.app/api/auth';
  private apiChildren = 'https://backend-child-development-tracker-production.up.railway.app/api/children';

  constructor(private http: HttpClient) { }

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string){
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  getName(): string | null {
    return localStorage.getItem('name');
}
  getAllChildrenData(): Observable<any> {
    return this.http.get(`${this.apiChildren}/getAllChildrenData`);
  }

  getAllChildren(): Observable<any> {
    return this.http.get(`${this.apiChildren}/getAllChildren`);
  }

  getChildById(id: number): Observable<any> {
    return this.http.get(`${this.apiChildren}/getChildById/${id}`);
  }

  createChild(childData: any): Observable<any> {
    return this.http.post(`${this.apiChildren}/createChild`, childData);
  }

  
}