import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FournisseurModel } from 'src/app/shared/models/fournisseur.model';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  _api = '/api';
  constructor(private http: HttpClient) {}

  getAllFournisseurs(page = 0, size = 2): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http.get<any>(this._api + '/fournisseurs', options);
  }

  addFournisseur(
    type: FournisseurModel
  ): Observable<FournisseurModel> {
    return this.http.post<FournisseurModel>(this._api+'/fournisseur', type);
  }

  getFournisseurById(typeId: number): Observable<FournisseurModel> {
    return this.http.get<FournisseurModel>(
      this._api + '/fournisseur/' + typeId
    );
  }

  updateFournisseur(
    typeId: number,
    type: FournisseurModel
  ): Observable<any> {
    return this.http.put(this._api + '/fournisseur/' + type.id, type);
  }

  delete(typeId: Number) {
    return this.http.delete<FournisseurModel>(
      this._api + '/fournisseur/' + typeId
    );
  }
}


