import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleModel } from 'src/app/shared/models/article.model';

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
   createProject(articleRequestDto: any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(this._api + '/projets/articleAdd', articleRequestDto, {
        headers,
      });
  }

  addArticle(article: ArticleModel): Observable<ArticleModel>{

    return this.http.post<ArticleModel>(this._api + '/article-add/', article);

  }
  getZonesStock(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8071/api/zones');
  }
  
  getUnitesMesure(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8071/api/uniteMesures');
  }
  
  getTypesArticle(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8071/api/types');
  }
  

  getArticleById(articleId: number): Observable<ArticleModel> {

    return this.http.get<ArticleModel>(this._api + '/article/' + articleId);
  }
  
  updateArticle(articleId: number, article: ArticleModel): Observable<any> {

    return this.http.put(this._api + '/article/' + article.id, articleId);
  }
  
  delete(articleId: Number) {

    return this.http.delete<ArticleModel>(this._api + '/Article/' + articleId);
  }

}
