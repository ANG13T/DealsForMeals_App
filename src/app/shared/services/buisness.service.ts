import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class BuisnessService {


  constructor(private afs: AngularFirestore) { 
   
  }

  async getBuisnesses(amount: number){
    let buisnesses: User[] = [];
    let promise = this.afs.firestore.collection("users").limit(amount).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let data = doc.data();
        let foodbank: User = {
          name: data.name,
          email: data.email,
          uid: data.uid,
          accountType: data.accountType,
          photoURL: data.photoURL,
          isBusiness: data.isBusiness,
          location: data.location
        }
        buisnesses.push(foodbank);
      })
      return buisnesses;
    })
    return promise;
  }

  // TODO: make category type specific
  async getCategoryBuisnesses(amount: number, category: string){
    let buisnesses: User[] = [];
    let promise = this.afs.firestore.collection("users").where("accountType", "==", category).limit(amount).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let data = doc.data();
        let foodbank: User = {
          name: data.name,
          email: data.email,
          uid: data.uid,
          accountType: data.accountType,
          photoURL: data.photoURL,
          isBusiness: data.isBusiness,
          location: data.location
        }
        buisnesses.push(foodbank);
      })
      return buisnesses;
    })
    return promise;
  }

  async getBuisnessByID(id: string){
    let buisness: User;
    let promise = this.afs.firestore.collection("users").doc(id).get().then((doc: any) => {
        let data = doc.data();
        buisness = {
          name: data.name,
          email: data.email,
          uid: data.uid,
          accountType: data.accountType,
          photoURL: data.photoURL,
          isBusiness: data.isBusiness,
          location: data.location
        } 
        return buisness;
    })
    return promise;
  }

}
