import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private afs: AngularFirestore) { }

  async getStores(amount: number): Promise<any>{
    let stores: User[] = [];
    let promise = this.afs.firestore.collection("users").where("accountType", "==", "store").limit(amount).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let data = doc.data();
        let store: User = {
          name: data.name,
          email: data.email,
          uid: data.uid,
          accountType: data.accountType
        }
        stores.push(store)
      })
      return stores;
    })
    return promise;
  }
}
