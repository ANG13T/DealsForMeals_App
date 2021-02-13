import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private afs: AngularFirestore) { }

  async createPost(post: Post): Promise<any>{
    this.afs.collection("posts").add(post).then(() => {
      console.log("post ", post, "created");
      return "success";
    }).catch((err) => {
      console.log(err)
      alert("Error: " + err);
      return err;
    })
  }

  async getPosts(uid: string): Promise<any>{
    let posts: Post[] = [];
    let promise = this.afs.firestore.collection("posts").where('userProfile.uid', '==', uid).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let docData = doc.data();
        let newPost: Post = {userProfile: docData.userProfile, title: docData.title, description: docData.description, images: docData.images, amount: docData.amount};
        posts.push(newPost);
      })
      return posts;
    });
    return promise;
  }
}
