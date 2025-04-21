import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilisateurModel } from 'src/app/shared/models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  _api = '/api';
  constructor(private http: HttpClient) { }

  getAllUsers(structureID: number, page: number = 0, size: number = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', size)
    }
    return this.http.get("/api/admin/users/structure/" + structureID, options);
  }
  addUtilisateur(utilisateur: UtilisateurModel): Observable<UtilisateurModel> {
console.log(utilisateur);

    return this.http.post<UtilisateurModel>(this._api+'/register', utilisateur);

  }
  getUtilisateurById(id: number) {
    throw new Error('Method not implemented.');
  }
}
