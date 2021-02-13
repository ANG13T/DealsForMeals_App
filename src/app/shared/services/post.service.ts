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
}
