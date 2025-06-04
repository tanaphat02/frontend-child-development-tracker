import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GrowthService {
  private apiRecords = 'https://backend-child-development-tracker-production.up.railway.app/api/growth';

  constructor(private http: HttpClient) { }

  createRecord(recordData: any): Observable<any> {
    return this.http.post(`${this.apiRecords}/createGrowthRecord`, recordData);
  }

  getAllRecords(): Observable<any> {
    return this.http.get(`${this.apiRecords}/getGrowthRecords`);
  }

  getLastRecordById(id: number): Observable<any> {
    return this.http.get(`${this.apiRecords}/getLatestGrowthRecord/${id}`);
  }
  getRecordsByChildId(id: number): Observable<any> {
    return this.http.get(`${this.apiRecords}/getAllRecordById/${id}`);
  }
  getDashboardStats(): Observable<any> {
  return this.http.get(`${this.apiRecords}/getGrowthStats`);
}

}
