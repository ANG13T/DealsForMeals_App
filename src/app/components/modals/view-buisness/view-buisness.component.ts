import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import {ActivatedRoute, Router} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewDealComponent } from '../view-deal/view-deal.component';
import { ViewAllDealsComponent } from '../view-all-deals/view-all-deals.component';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-view-buisness',
  templateUrl: './view-buisness.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view-buisness.component.scss'],
})
export class ViewBuisnessComponent implements OnInit {

  buisness: User;
  posts: Post[] = [];
  loadingPosts:boolean = false;
  previewDeals: Post[] = [];
  shownItem: string = 'deals';
  displayLocation: string;
  selectedIndex: string = "deals";

  constructor(private buisnessService: BuisnessService, private route:ActivatedRoute, private router: Router, private modalCtrl: ModalController, private postService: PostService, private modalController: ModalController, private emailSender: EmailComposer) { }

  ngOnInit() {
    this.loadingPosts = true;
    if(!this.buisness){
      let buisnessID = this.route.snapshot.params['id'];
      this.buisnessService.getBuisnessByID(buisnessID).then((buisness) => {
        this.buisness = buisness;
      })
    }

    this.postService.getDealsForUser(this.buisness.uid).then((postData) => {
      this.posts = postData;
      this.previewDeals = this.posts.slice(0, 4);
      this.loadingPosts = false;
    });

    let location = this.buisness.location;
    this.displayLocation = `${location.subThoroughfare} ${location.thoroughfare}, ${location.subLocality} ${location.locality}, ${location.administrativeArea}`;

    if(this.buisness.description == ""){
      this.buisness.description = "Buisness has not written a description yet.";
    }
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

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  viewDescription(description: string) {
    if (description.length > 40) {
      let result = description.trim().substr(0, 40).concat("...");
      return result;
    }
    return description.trim();
  }

  async presentViewAllDeals(){
    const modal = await this.modalController.create({
      component: ViewAllDealsComponent,
      componentProps: { 
        deals: this.posts,
        swipeToClose: true
      }
    });

    return await modal.present();
  }

   async dismissModal() {
     console.log("closing")
    const modal = await this.modalCtrl.getTop();
    modal.dismiss();
  }

  contactBuisness(){
    this.emailSender.open({
      to:     this.buisness.email,
      subject: 'DealsForMeals Buisness Request'
    }).then(() => {
      console.log("done!")
    }).catch((err) => {
      console.log("something went wrong");
    });
  }

}
