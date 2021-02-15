import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {

  post: Post;
  initPost: Post;
  errors = {title: "", description: "", amount: ""};
  imageLoading: boolean = false;

  constructor(private _modalController: ModalController) { }

  ngOnInit() {
    this.initPost = this.post;
  }

  dismissModal(status?: string, post?: Post){
    this._modalController.dismiss({
      'dismissed': true,
      status: status,
      data: post
    });
  }

  compareWithFn = (o1, o2) => {
    return o1 == o2;
  };

  updatePost(){

  }

  validateForm(){
    if(this.post.title.length < 5){
      this.errors.title = "Title must be longer than 5 letters";
      return false;
    }

    if(this.post.title.length >= 80){
      this.errors.title = "Title must be shorter than 80 letters";
      return false;
    }

    if(this.post.description.length >= 200){
      this.errors.description = "Title must be shorter than 200 letters";
      return false;
    }

    if(this.post.userProfile == null){
      alert("Something went wrong.");
      return false;
    }

    if(this.imageLoading){
      alert("Image Uploading...");
      return false;
    }

    if(this.post.description.length < 10){
      this.errors.description = "Title must be longer than 10 letters";
      return false;
    }
    return true;
  }

}
