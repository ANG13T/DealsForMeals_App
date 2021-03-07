import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import * as firebase from 'firebase/app';
import { Location } from '../models/location.model';
// import geofire = require('geofire-common');
import * as geofire from 'geofire-common';
// import { GeoFirestore } from 'geofirestore';

@Injectable({
  providedIn: 'root'
})
export class BuisnessService {


  constructor(private afs: AngularFirestore) { 
  
  }

  async getBuisnessesNearLocation(location: Location){
    let center = [location.latitude, location.longitude];
    const radiusInM = 50 * 1000;

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
const promises = [];
for (const b of bounds) {
  let entireRef = this.afs.collection('users', ref => {
    const q = ref.orderBy('location')
    .startAt(b[0])
    .endAt(b[1]);
    promises.push(q.get());
    return q;
  })
  await entireRef;
}

// Collect all the query results together into a single list
Promise.all(promises).then((snapshots) => {
  const matchingDocs = [];

  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const lat = doc.get('lat');
      const lng = doc.get('lng');

      // We have to filter out a few false positives due to GeoHash
      // accuracy, but most will match
      const distanceInKm = geofire.distanceBetween([lat, lng], center);
      const distanceInM = distanceInKm * 1000;
      if (distanceInM <= radiusInM) {
        matchingDocs.push(doc);
      }
    }
  }

  return matchingDocs;
}).then((matchingDocs) => {
  // Process the matching documents
  // ...
  console.log("the matching docs are", matchingDocs)
});


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
