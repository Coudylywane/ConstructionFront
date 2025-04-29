import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrixFCFA'
})
export class FormatPrixFCFAPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) return '0 FCFA';  // Si la valeur est null, on retourne 0 FCFA

    // Formater le prix avec des séparateurs de milliers
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace('XOF', 'FCFA');  // Remplacer 'XOF' par 'FCFA'
  }

}
