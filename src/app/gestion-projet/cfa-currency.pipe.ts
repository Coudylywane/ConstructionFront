import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'cfaCurrency',
})
export class CfaCurrencyPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    locale: string = 'fr-FR'
  ): string {
    if (value == null || isNaN(value)) {
      return 'N/A';
    }
    // Format the number without decimals, using the specified locale
    const formattedNumber = formatNumber(value, locale, '1.0-0');
    // Append ' F CFA'
    return `${formattedNumber} F CFA`;
  }
}
