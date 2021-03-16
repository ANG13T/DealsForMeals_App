import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buisnessCategory'
})
export class BuisnessCategoryPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
