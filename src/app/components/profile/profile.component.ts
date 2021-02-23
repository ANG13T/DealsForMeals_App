import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreatePostComponent } from '../modals/create-post/create-post.component';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewPostComponent } from '../view-post/view-post.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  user: User;
  loading: boolean = true;
  posts: Post[] = [];

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
      this.loading = false;
    });
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  logOut(){
    this.userService.signOut();
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
      component: ViewPostComponent,
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
