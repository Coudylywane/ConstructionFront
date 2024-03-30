import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
