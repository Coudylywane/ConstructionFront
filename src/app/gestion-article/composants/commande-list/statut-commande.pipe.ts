import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statutCommande'
})
export class StatutCommandePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'EN_COURS':
        return 'En cours';
      case 'VALIDEE':
        return 'Validée';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return 'Inconnu';
    }

}

}