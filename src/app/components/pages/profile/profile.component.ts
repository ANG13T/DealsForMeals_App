import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreatePostComponent } from '../../modals/create-post/create-post.component';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewDealComponent } from '../../modals/view-deal/view-deal.component';
import { ViewAllDealsComponent } from '../../modals/view-all-deals/view-all-deals.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  // TODO: get stream of data as user profile deals and data?
  user: User;
  userAddress: string = "";
  loading: boolean = true;
  posts: Post[] = [];
  recentDeals: Post[] = [];
  showDealsInfo: boolean = false;
  map: any;
  isBuisness: boolean = false;
  selectedIndex: string = "deals";

  constructor(private userService: UserService, private router: Router, public modalController: ModalController, private postService: PostService) { }

  ngOnInit() {
    this.loading = true;
    this.userService.user$.subscribe(async (userProfile) => {
      console.log(userProfile)
      if(!userProfile) return;
      this.user = userProfile;
      if(this.user.isBusiness){
        this.isBuisness = true;
        await this.postService.getDealsForUser(this.user.uid).then((data) => {
          console.log("got the posts", data)
          this.posts = data;
          this.recentDeals = this.posts.slice(0, 4);
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
        
      this.showDealsInfo = (this.posts == []);
      
      this.loading = false;
    });
  }


  navigate(route: string){
    if(route != ""){
      this.router.navigate([`/${route}`]);
    }
  }

  viewDescription(description: string){
    if(description.length > 36){
      let result = description.trim().substr(0, 36).concat("...");
      return result;
    }
    return description.trim();
  }

  viewProfileDescription(description: string){
    if(description.length > 45){
      let result = description.trim().substr(0, 45).concat("...");
      return result;
    }
    return description.trim();
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

  async presentViewAllDeals(){
    const modal = await this.modalController.create({
      component: ViewAllDealsComponent,
      componentProps: { 
        deals: this.posts
      }
    });

    return await modal.present();
  }

  async presentPost(post: Post){
    const modal = await this.modalController.create({
      component: ViewDealComponent,
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
