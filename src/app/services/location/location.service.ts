import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private baseUrl = 'https://backend-child-development-tracker-production.up.railway.app/api/location';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/provinces`);
  }

  getDistricts(provinceId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/districts/${provinceId}`);
  }

  getSubDistricts(amphureId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sub-districts/${amphureId}`);
  }
}
