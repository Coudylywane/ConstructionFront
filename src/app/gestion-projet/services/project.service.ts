import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Projet } from 'src/app/shared/models/projet';

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

  getAllProjets(page = 0, perPage = 50): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('perPage', perPage),
    };
    return this.http.get<any>(this._api + '/projets', options);
  }

  // getAllProjects(args: any): Observable<any> {
  //   const params = new HttpParams()
  //     .set('page', args?.page?.toString())
  //     .set('perPage', args?.perPage?.toString());
  //   return this.http.get<any>(this._api + '/projets', { params });
  // }

  getFournisseurById(typeId: number): Observable<Projet> {
    return this.http.get<Projet>(this._api + '/fournisseur/' + typeId);
  }

  // updateFournisseur(typeId: number, type: Projet): Observable<any> {
  //   return this.http.put(this._api + '/fournisseur/' + type.id, type);
  // }

  delete(typeId: Number) {
    return this.http.delete<Projet>(this._api + '/fournisseur/' + typeId);
  }

  getProjetById(id: number): Observable<Projet> {
    return this.http
      .get<Projet>(`${this._api}/projets/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error("Une erreur s'est produite:", error);
    return throwError(
      "Une erreur s'est produite lors de la récupération des détails du projet."
    );
  }

  validateProject(id: number, status: string): Observable<any> {
    return this.http.post(`${this._api}/projets/project/${id}`, null, {
      params: { status },
    });
  }
}
