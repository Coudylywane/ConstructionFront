import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {MessageModel} from '../../shared/models/message.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailboxService {

  api = '/api/socket';

  constructor(private http: HttpClient) { }

  sendMessageRest(data: MessageModel) {
    return this.http.post(this.api, data);
  }

  listDiscussion(): Observable<any> {
    return this.http.get(this.api + '/list-discussion');
  }

  historiqueDiscussionBetweenTwoUser(userId: any, idDestinataire: any): Observable<any> {
    return this.http.get(this.api + '/historique-discussion/user/' + userId + '/destinataire/' + idDestinataire);
  }
}
