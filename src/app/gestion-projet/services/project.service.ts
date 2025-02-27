import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Projet } from 'src/app/shared/models/projet';
import { Tache } from 'src/app/shared/models/Tache.model';

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

  getFournisseurById(typeId: number): Observable<Projet> {
    return this.http.get<Projet>(this._api + '/fournisseur/' + typeId);
  }

  delete(typeId: Number) {
    return this.http.delete<Projet>(this._api + '/fournisseur/' + typeId);
  }

  getProjetById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this._api}/projets/${id}`)
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

  creerDevis(devis: any): Observable<any> {
    return this.http.post(
      `${this._api}/devis/?projetId=${devis.projetId}`,
      devis,
      { responseType: 'text' } // Important pour éviter l'erreur de parsing
    );
  }

  downloadDevisPdf(devisId: number): Observable<Blob> {
    return this.http.get(`${this._api}/devis/${devisId}/pdf`, {
      responseType: 'blob',
    });
  }

  verifierDevisExistant(projetId: number): Observable<any> {
    return this.http.get<any>(`${this._api}/devis/projet/${projetId}`);
  }

  validerDevis(id: number): Observable<any> {
    return this.http.put(`${this._api}/devis/${id}/valider`, null);
  }

  annulerDevis(id: number): Observable<any> {
    return this.http.put(`${this._api}/devis/${id}/refuser`, null);
  }

  obtenirTousLesDevis(): Observable<any> {
    return this.http.get<any>(`${this._api}/devis`);
  }

  ajouterTache(tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this._api}/taches/add`, tache);
  }

  listerTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this._api}/taches/list`);
  }
}
