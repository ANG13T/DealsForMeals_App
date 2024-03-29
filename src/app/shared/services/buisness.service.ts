import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import * as firebase from 'firebase/app';
import { Location } from '../models/location.model';
// import geofire = require('geofire-common');
import * as geofire from 'geofire-common';
import { map } from 'rxjs/operators';
// import { GeoFirestore } from 'geofirestore';

@Injectable({
  providedIn: 'root'
})
export class BuisnessService {


  constructor(private afs: AngularFirestore) {

  }

  buisnesses$ = this.afs.collection("users", ref => ref.where('isBusiness', '==', true).orderBy('hash')).snapshotChanges().pipe(map(actions => {
    return actions.map(p => {
      const doc = p.payload.doc;
      const docData: any = doc.data();
      let user: User = { uid: doc.id, name: docData.name, email: docData.email, accountType: docData.accountType, lat: docData.lat, lng: docData.lng, hash: docData.hash, phoneNumber: docData.phoneNumber, description: docData.description, location: docData.location, photoURL: docData.photoURL, isBusiness: docData.isBusiness, upvotes: docData.upvotes,
        downvotes: docData.downvotes };
      return user;
    });
  }))

  async getBuisnessesNearLocation(location: Location): Promise<any> {
    let center = [location.latitude, location.longitude];
    const radiusInM = 50 * 1000;

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
      const q = this.afs.collection('users').ref.orderBy('hash')
        .startAt(b[0])
        .endAt(b[1]);

      promises.push(q.get());
    }

    // Collect all the query results together into a single list
    let result = Promise.all(promises).then((snapshots) => {
      const matchingDocs: User[] = [];

      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const userData = doc.data();
          const lat = userData.lat;
          const lng = userData.lng;
          userData.id = doc.id;


          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            // let userDoc = {doc.data().uid, } as User;
            if(userData.isBusiness){
              matchingDocs.push(userData);
            }
            
          }
        }
      }

      return matchingDocs;
    }).then((matchingDocs) => {
      return matchingDocs;
    });
    return result;
  }

  async getBuisnesses(amount: number) {
    let buisnesses: User[] = [];
    let promise = this.afs.firestore.collection("users").where('isBusiness', '==', true).limit(amount).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let data = doc.data();
        let foodbank: User = {
          name: data.name,
          email: data.email,
          uid: data.uid,
          accountType: data.accountType,
          photoURL: data.photoURL,
          isBusiness: data.isBusiness,
          location: data.location,
          upvotes: data.upvotes,
          downvotes: data.downvotes
        }
        buisnesses.push(foodbank);
      })
      return buisnesses;
    })
    return promise;
  }

  // TODO: make category type specific
  async getCategoryBuisnesses(amount: number, category: string) {
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
          location: data.location,
          upvotes: data.upvotes,
          downvotes: data.downvotes
        }
        buisnesses.push(foodbank);
      })
      return buisnesses;
    })
    return promise;
  }

  async getBuisnessByID(id: string) {
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
        location: data.location,
        upvotes: data.upvotes,
        downvotes: data.downvotes
      }
      return buisness;
    })
    return promise;
  }

}
