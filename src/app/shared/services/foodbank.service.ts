import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FoodbankService {

  constructor(private afs: AngularFirestore) { }

  async getFoodbanks(amount: number): Promise<any>{
    let foodbanks: User[] = [];
    let promise = this.afs.firestore.collection("users").where("accountType", "==", "foodbank").limit(amount).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let data = doc.data();
        let foodbank: User = {
          name: data.name,
          email: data.email,
          uid: data.uid,
          accountType: data.accountType,
          isBusiness: data.isBusiness
        }
        foodbanks.push(foodbank);
      })
      return foodbanks;
    })
    return promise;
  }
}
