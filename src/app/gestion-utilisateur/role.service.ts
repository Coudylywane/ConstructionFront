import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleModel } from '../shared/models/role.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  _api = '/api';
  getAllRoles(): Observable<RoleModel> {
   return this.http.get<RoleModel>(`${this._api}/role`);
  }

  constructor(private http: HttpClient) { }
}
