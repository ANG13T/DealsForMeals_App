import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'buisnessCategory'
})
export class BuisnessCategoryPipe implements PipeTransform {

  transform(buisnesses: User[], categories: string[]) {
    let lowercasedCategories = categories.map(cat => cat.toLowerCase())
    let modifiedCategories = lowercasedCategories.map(cat => {
      if(cat[cat.length - 1] == "s"){
        return cat.slice(0, cat.length - 1);
      }
      return cat;
    })
    return buisnesses.filter(buisness => modifiedCategories.includes(buisness.accountType));
  }

}
