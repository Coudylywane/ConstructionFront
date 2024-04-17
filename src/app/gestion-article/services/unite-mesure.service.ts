import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UniteMesureModel } from 'src/app/shared/models/unite-mesure.model';

@Injectable({
  providedIn: 'root',
})
export class UniteMesureService {
  _api = '/api';
  constructor(private http: HttpClient) {}

  getAllUniteMesures(page = 0, size = 2): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http.get<any>(this._api + '/uniteMesures', options);
  }

  addUnite(unite: UniteMesureModel): Observable<UniteMesureModel> {
    return this.http.post<UniteMesureModel>('/api/unite', unite);
  }

  getUniteById(uniteId: number): Observable<UniteMesureModel> {
    return this.http.get<UniteMesureModel>('/api/unite/' + uniteId);
  }

  updateUnite(uniteId: number, unite: UniteMesureModel): Observable<any> {
    return this.http.put('/api/unite/' + unite.id, unite);
  }

  delete(uniteMesureId: Number) {
    return this.http.delete<UniteMesureModel>('/api/unite/' + uniteMesureId);
  }
}
