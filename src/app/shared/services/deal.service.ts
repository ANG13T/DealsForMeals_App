import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Location } from '../models/location.model';
import { Deal } from '../models/deal.model';
import { User } from '../models/user.model';
import * as geofire from 'geofire-common';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { }

  async createDeal(post: Deal): Promise<any> {
    this.afs.collection("deals").add(post).then((doc) => {
      post.id = doc.id;
      return post;
    }).catch((err) => {
      console.log(err)
      alert("Error: " + err);
      return err;
    })
  }


  async getDealsForUser(uid: string): Promise<any> {
    let posts: Deal[] = [];
    let promise = this.afs.firestore.collection("deals").where('userProfile.uid', '==', uid).orderBy("createdAt").get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let docData = doc.data();
        let newPost: Deal = { userProfile: docData.userProfile, title: docData.title, description: docData.description, images: docData.images, id: doc.id, createdAt: docData.createdAt };
        posts.push(newPost);
      })
      return posts;
    });
    return promise;
  }

  // deals$ = this.afs.collection("deals").snapshotChanges().pipe(map(actions => {
  //   return actions.map(p => {
  //     const doc = p.payload.doc;
  //     const id = doc.id;
  //     const docData:any = doc.data();
  //     let newDeal: Deal = {userProfile: docData.userProfile, title: docData.title, description: docData.description, images: docData.images, id: doc.id, createdAt: docData.created};
  //     return newDeal;
  //   });
  // }))

  getDeals(amount: number): Promise<any> {
    let deals: Deal[] = [];
    let promise = this.afs.firestore.collection("deals").limit(amount).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let docData = doc.data();
        let newDeal: Deal = { userProfile: docData.userProfile, title: docData.title, description: docData.description, images: docData.images, id: doc.id, createdAt: docData.created };
        deals.push(newDeal);
      })
      return deals;
    });
    return promise;
  }

  deals$ = this.afs.collection("deals").snapshotChanges().pipe(map(actions => {
    return actions.map(p => {
      const doc = p.payload.doc;
      const id = doc.id;
      const docData: any = doc.data();
      let newDeal: Deal = { userProfile: docData.userProfile, title: docData.title, description: docData.description, images: docData.images, id: doc.id, createdAt: docData.created };
      return newDeal;
    });
  }))

  async getDealsNearLocation(location: Location): Promise<any> {
    let center = [location.latitude, location.longitude];
    const radiusInM = 50 * 1000;

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
      const q = this.afs.collection('deals').ref.orderBy('hash')
        .startAt(b[0])
        .endAt(b[1]);

      promises.push(q.get());
    }

    // Collect all the query results together into a single list
    let result = Promise.all(promises).then((snapshots) => {
      const matchingDocs: User[] = [];

      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const dealData = doc.data();
          const lat = dealData.lat;
          const lng = dealData.lng;

          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push(dealData);
          }
        }
      }

      return matchingDocs;
    }).then((matchingDocs) => {
      console.log("the matching docs are", matchingDocs)
      return matchingDocs;
    });
    return result;
  }

  async deleteDeal(post: Deal): Promise<any> {
    const fileStorage = this.storage;
    let promise = this.afs.firestore.collection("deals").doc(post.id).delete().then(async () => {
      for (let image of post.images) {
        let storageRefFile = fileStorage.refFromURL(image);
        await storageRefFile.delete().toPromise().catch((error) => {
          console.log("error with storage file delete", error.message);
          return error;
        });
      }
      return;
    }).catch((err) => {
      alert("Error: " + err.message);
      return err;
    });
    return promise;
  }

  async updateDeal(post: Deal): Promise<any> {
    let promise = this.afs.firestore.collection("deals").doc(post.id).update(post).then(() => {
      return;
    }).catch((err) => {
      alert("Error: " + err.message);
      return err;
    });
    return promise;
  }

  // Pagination Methods
  paginate(limit: number, last: any): Observable<DocumentChangeAction<any>[]> {
    let submit;

    if ((typeof last) != "number") {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(last.seconds);
      submit = t;
    } else {
      submit = new Date(last);
    }

    console.log("timing", submit);
    return this.afs.collection('deals', (ref) => (
      ref
        .where('createdAt', '<', submit)
        .orderBy('createdAt', 'desc')
        .orderBy('hash')
        .limit(limit)
    )).snapshotChanges();
  }

  // paginate deals based on location
  paginateLocation(limit: number, last: any, location: Location) {
    let submit;

    if ((typeof last) != "number") {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(last.seconds);
      submit = t;
    } else {
      submit = new Date(last);
    }

    let center = [location.latitude, location.longitude];
    const radiusInM = 50 * 1000;

    return this.afs.collection('deals', (ref) => (
      ref
        .where('createdAt', '<', submit)
        .orderBy('createdAt', 'desc')
        .orderBy('hash')
        .limit(limit)
    )).snapshotChanges();


    // const bounds = geofire.geohashQueryBounds(center, radiusInM);
    // console.log("bounds are", bounds)
    // const promises = [];
    // for (const b of bounds) {
    //   const q = this.afs.collection('deals').ref.where('createdAt', '<', submit).orderBy('createdAt', 'desc').orderBy('hash')
    //     .startAt(b[0])
    //     .endAt(b[1]);

    //   promises.push(q.get());
    // }

    // Collect all the query results together into a single list
    // let result = Promise.all(promises).then((snapshots) => {
    //   const matchingDocs: User[] = [];
    //   console.log("got to result", snapshots);

    //   for (const snap of snapshots) {
    //     console.log("snap", snap)
    //     for (const doc of snap.docs) {
    //       const dealData = doc.data();
    //       console.log("deal data", dealData);
    //       const lat = dealData.lat;
    //       const lng = dealData.lng;

    //       const distanceInKm = geofire.distanceBetween([lat, lng], center);
    //       const distanceInM = distanceInKm * 1000;
    //       if (distanceInM <= radiusInM) {
    //         matchingDocs.push(dealData);
    //       }
    //     }
    //   }
    // })
    // return result;
  }


}
