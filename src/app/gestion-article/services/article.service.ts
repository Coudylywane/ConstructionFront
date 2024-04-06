import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  _api = '/api';
  constructor(private http: HttpClient) {}

  getAllArticles(page = 0, size = 2): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http.get<any>( this._api+'/articles', options);
  }
}
