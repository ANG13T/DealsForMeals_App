import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from '../models/post.model';

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

  async getDeals(uid: string): Promise<any>{
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
