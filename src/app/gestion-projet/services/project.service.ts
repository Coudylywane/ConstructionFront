import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  _api = '/api';
  constructor(private http: HttpClient) {}

  // Méthode pour créer un projet
  createProject(projectRequestDto: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this._api + '/projets/create', projectRequestDto, {
      headers,
    });
  }
}
