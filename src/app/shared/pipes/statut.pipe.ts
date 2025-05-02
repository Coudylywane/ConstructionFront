import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statut',
})
export class StatutPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'VALIDE':
      case 'VALIDER': // Support pour la faute potentielle
        return 'Validé';
      case 'ANNULE':
        return 'Annulé';
      default:
        return value;
    }
  }
}
