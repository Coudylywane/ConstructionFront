import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandeModel } from 'src/app/shared/models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

   _api = '/api';
    constructor(private http: HttpClient) {}

  //passerCommande(type: detailsCommande[]): Observable<any> {
    //return this.http.post<detailsCommande>(this._api +'/commande', type);
  //}

  passerCommande(commande: CommandeModel): Observable<any> {
    return this.http.post<any>(this._api + '/commande', commande);
  }
  


  
}
