import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '../models/location.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import * as geofire from 'geofire-common';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private afs: AngularFirestore) { }

  async createDeal(post: Post): Promise<any>{
    this.afs.collection("deals").add(post).then((doc) => {
      console.log("post ", post, "created");
      post.id = doc.id;
      return post;
    }).catch((err) => {
      console.log(err)
      alert("Error: " + err);
      return err;
    })
  }

  async getDealsForUser(uid: string): Promise<any>{
    let posts: Post[] = [];
    let promise = this.afs.firestore.collection("deals").where('userProfile.uid', '==', uid).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let docData = doc.data();
        let newPost: Post = {userProfile: docData.userProfile, title: docData.title, description: docData.description, images: docData.images, amount: docData.amount, id: doc.id};
        posts.push(newPost);
      })
      return posts;
    });
    return promise;
  }

  getDeals(amount: number): Promise<any>{
    let deals: Post[] = [];
    let promise = this.afs.firestore.collection("deals").limit(amount).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let docData = doc.data();
        let newDeal: Post = {userProfile: docData.userProfile, title: docData.title, description: docData.description, images: docData.images, amount: docData.amount, id: doc.id};
        deals.push(newDeal);
      })
      return deals;
    });
    return promise;
  }

  async getDealsNearLocation(location: Location): Promise<any>{
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

          console.log("doc is ", doc, "lat: ", lat, "long: ", lng)

          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            // let userDoc = {doc.data().uid, } as User;
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

  async deleteDeal(postID: string): Promise<any>{
    let promise = this.afs.firestore.collection("deals").doc(postID).delete().then(() => {
      return;
    }).catch((err) => {
      alert("Error: " + err.message);
      return err;
    });
    return promise;
  }

  async updateDeal(post: Post): Promise<any>{
    let promise = this.afs.firestore.collection("deals").doc(post.id).update(post).then(() => {
      return;
    }).catch((err) => {
      alert("Error: " + err.message);
      return err;
    });
    return promise;
  }

}
