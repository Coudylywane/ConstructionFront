import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategorieFournisseurModel } from 'src/app/shared/models/categorie-fournisseur.model';

@Injectable({
  providedIn: 'root',
})
export class CategorieFourisseurService {
  _api = '/api';
  constructor(private http: HttpClient) {}

  getAllCategorieFournisseurs(page = 0, size = 2): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http.get<any>(this._api + '/categorieFournisseur', options);
  }

  getCategorieFournisseurs(): Observable<any> {
    return this.http.get<any>(this._api + '/categorie-fournisseur');
  }

  addCategorieFournisseur(
    type: CategorieFournisseurModel
  ): Observable<CategorieFournisseurModel> {
    return this.http.post<CategorieFournisseurModel>(
      this._api + '/categorie-fournisseur',
      type
    );
  }

  getCategorieFournisseurById(
    typeId: number
  ): Observable<CategorieFournisseurModel> {
    return this.http.get<CategorieFournisseurModel>(
      this._api + '/categorieFournisseur/' + typeId
    );
  }

  updateCategorieFournisseur(
    typeId: number,
    type: CategorieFournisseurModel
  ): Observable<any> {
    return this.http.put(this._api + '/categorie-fournisseur/' + type.id, type);
  }

  delete(typeId: Number) {
    return this.http.delete<CategorieFournisseurModel>(
      this._api + '/categorie-fournisseur/' + typeId
    );
  }
}
