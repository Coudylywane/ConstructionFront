import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ZoneStockModel } from 'src/app/shared/models/zone-stock.model';

@Injectable({
  providedIn: 'root',
})
export class ZoneStockService {
  _api = '/api';
  constructor(private http: HttpClient) {}

  getAllZones(page = 0, size = 2): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http.get<any>(this._api + '/zones', options);
  }

  addZone(zone: ZoneStockModel): Observable<ZoneStockModel> {
    return this.http.post<ZoneStockModel>('/api/zone', zone);
  }
}
