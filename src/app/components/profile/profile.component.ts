import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreatePostComponent } from '../modals/create-post/create-post.component';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewDealComponent } from '../view-deal/view-deal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  user: User;
  userAddress: string = "";
  loading: boolean = true;
  posts: Post[] = [];
  steps: any[] = [];

  map: any;

  constructor(private userService: UserService, private router: Router, public modalController: ModalController, private postService: PostService) { }

  ngOnInit() {
    this.loading = true;
    this.userService.user$.subscribe(async (userProfile) => {
      console.log(userProfile)
      if(!userProfile) return;
      this.user = userProfile;
      if(this.user.isBusiness){
        await this.postService.getDealsForUser(this.user.uid).then((data) => {
          console.log("got the posts", data)
          this.posts = data;
        })
      }else{
        await this.postService.getDealsForUser(this.user.uid).then((data) => {
          console.log("got the posts", data)
          this.posts = data;
        })
      }
      this.userAddress = `${this.user.location.locality}, ${this.user.location.administrativeArea}`;
      if(this.user.description == ""){
        this.user.description = "User has not written a description yet.";
      }

      this.findNextSteps();
      this.loading = false;
    });
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  viewDescription(description: string){
    if(description.length > 36){
      let result = description.trim().substr(0, 36).concat("...");
      return result;
    }
    return description.trim();
  }

  logOut(){
    this.userService.signOut();
  }

  findNextSteps(){
    if(this.user.isBusiness){ 
      if(this.user.photoURL == "https://firebasestorage.googleapis.com/v0/b/deals2meals-4e239.appspot.com/o/default_user.jpg?alt=media&token=e1c97c88-5aab-487b-ae6d-878415e28b6a"){
        this.steps.push({content: 'Enter a Profile Image', link: 'profile/edit'});
      }

      if(this.user.description == ""){
        this.steps.push({content: 'Enter a Buisness Description', link: 'profile/edit'});
      }

      if(this.posts == []){
        this.steps.push({content: 'Make your First Deal', link: 'profile/edit'});
      }
    }else{
      this.steps.concat([{content: 'Find a Buisness Near You', link: 'foodbanks'}, {content: 'Contact the Buisness', link: ''}, {content: 'Receive your Donation', link: ''}]);
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CreatePostComponent,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss()
    .then((data) => {
      console.log("got the data", data)
      if(data.data.status == "create"){
        this.posts.push(data.data.data);
      }
    });

    return await modal.present();
  }

  async presentPost(post: Post){
    const modal = await this.modalController.create({
      component: ViewDealComponent,
      cssClass: 'my-custom-class',
      componentProps: { 
        origin: 'profile',
        post: post,
        isOwner: true
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log("got the data", data)
        if(data.data.status == "delete"){
          this.posts = this.posts.filter((el) => {el.id != data.data.data.id});
        }
    });

    return await modal.present();
  }

}
