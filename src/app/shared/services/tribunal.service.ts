import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TribunalService {
  listDemande(structureID: number, page: number, size: number) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
