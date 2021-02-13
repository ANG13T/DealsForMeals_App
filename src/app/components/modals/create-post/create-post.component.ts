import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {

  post: Post = {title: "", description: "", userProfile: null, images: [], amount: 1};
  errors = {title: "", description: "", amount: ""};
  loading: boolean = false;
  complete: boolean = false;

  constructor(private modalController: ModalController, private router: Router, private userService: UserService, private postService: PostService) { 
    this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.post.userProfile = userProfile;
        this.post.images = ["https://upload.wikimedia.org/wikipedia/commons/2/22/Pacific_Walrus_-_Bull_%288247646168%29.jpg"]
      }
    })
  }

  ngOnInit() {
    
  }

  dismissModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
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

    if(this.post.description.length < 10){
      this.errors.description = "Title must be longer than 10 letters";
      return false;
    }
    return true;
  }

  compareWithFn = (o1, o2) => {
    return o1 == o2;
  };

  async createPost(){
    this.loading = true;
    if(this.validateForm()){
      await this.postService.createPost(this.post).then((result) => {
        this.loading = false;
        this.complete = true;
        if(result == "success"){
          this.dismissModal();
        }
      })  
    }
  }

}
