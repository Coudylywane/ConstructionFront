import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeFournisseurModel } from 'src/app/shared/models/type-fournisseur.model';

@Injectable({
  providedIn: 'root',
})
export class TypeFournisseurService {
  _api = '/api';
  constructor(private http: HttpClient) {}

  getAllTypeFournisseurs(page = 0, size = 2): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http.get<any>(this._api + '/typeFournisseur', options);
  }

  getTypeFournisseurs(): Observable<any> {
    return this.http.get<any>(this._api + '/type-fournisseur');
  }

  addTypeFournisseur(
    type: TypeFournisseurModel
  ): Observable<TypeFournisseurModel> {
    return this.http.post<TypeFournisseurModel>(
      this._api + '/type-fournisseur',
      type
    );
  }

  getTypeFournisseurById(typeId: number): Observable<TypeFournisseurModel> {
    return this.http.get<TypeFournisseurModel>(
      this._api + '/typeFournisseur/' + typeId
    );
  }

  updateTypeFournisseur(
    typeId: number,
    type: TypeFournisseurModel
  ): Observable<any> {
    return this.http.put(this._api + '/type-fournisseur/' + type.id, type);
  }

  delete(typeId: Number) {
    return this.http.delete<TypeFournisseurModel>(
      this._api + '/type-fournisseur/' + typeId
    );
  }
}
