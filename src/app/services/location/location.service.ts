import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) { }

  getProvinces(): Observable<any> {
    return this.http.get<any>('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json');
  }

  getDistricts(provinceCode: string): Observable<any> {
    return this.http.get<any>(`https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json`);
  }

  getSubDistricts(districtCode: string): Observable<any> {
    return this.http.get<any>(`https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json`);
  }
  
}