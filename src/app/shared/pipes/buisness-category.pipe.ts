import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'buisnessCategory'
})
export class BuisnessCategoryPipe implements PipeTransform {

  transform(buisnesses: User[], categories: string[], freePass?: boolean) {
    console.log("free pass", freePass)
    if(freePass){
      return buisnesses;
    }
    let lowercasedCategories = categories.map(cat => cat.toLowerCase())
    let modifiedCategories = lowercasedCategories.map(cat => {
      if(cat[cat.length - 1] == "s"){
        return cat.slice(0, cat.length - 1);
      }
      return cat;
    })
    console.log("cats", modifiedCategories)
    return buisnesses.filter(buisness => modifiedCategories.includes(buisness.accountType));
  }

}
