import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeArticleModel } from 'src/app/shared/models/type-article.model';

@Injectable({
  providedIn: 'root',
})
export class TypeArticleService {
  _api = '/api';
  constructor(private http: HttpClient) {}

  getAllTypeArticles(page = 0, size = 2): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http.get<any>(this._api + '/types', options);
  }

  addType(type: TypeArticleModel): Observable<TypeArticleModel> {
    return this.http.post<TypeArticleModel>(this._api + '/typeArticles', type);
  }

  getTypeById(typeId: number): Observable<TypeArticleModel> {
    return this.http.get<TypeArticleModel>(this._api + '/type/' + typeId);
  }

  updateType(typeId: number, type: TypeArticleModel): Observable<any> {
    return this.http.put(this._api + '/typeArticles/' + type.id, type);
  }

  delete(typeId: Number) {
    return this.http.delete<TypeArticleModel>(
      this._api + '/typeArticles/' + typeId
    );
  }
}
