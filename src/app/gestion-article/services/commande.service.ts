import { HttpClient, HttpParams } from '@angular/common/http';
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

  getCommandeById(commandeId: number): Observable<CommandeModel> {
  
      return this.http.get<CommandeModel>(this._api + '/commande/' + commandeId);
    }
  
  updateCommande(commandeId: number, commande: CommandeModel): Observable<any> {
  
    return this.http.put(this._api + '/commande/' + commande.id, commandeId);
  }
  
  getAllCommande(page = 0, size = 2): Observable<CommandeModel> {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http.get<CommandeModel>( this._api+'/commandes', options);

    }
  


  
}
