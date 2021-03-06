import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewBuisnessComponent } from '../view-buisness/view-buisness.component';
import { IonRouterOutlet } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { ViewDealComponent } from '../view-deal/view-deal.component';
import * as firebase from 'firebase/app';
import { Location } from 'src/app/shared/models/location.model';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-foodbanks',
  templateUrl: './foodbanks.component.html',
  styleUrls: ['./foodbanks.component.scss'],
})
export class FoodbanksComponent implements OnInit {

  foodbanks: User[];
  user: User;
  deals: Post[] = [];
  loadingFoodbanks: boolean = false;
  loadingDeals: boolean = false;
  showFoodbanks: boolean = true;



  constructor(private buisnessService: BuisnessService, private postService: PostService, private routerOutlet: IonRouterOutlet, private modalController: ModalController, private userService: UserService) { }

  async ngOnInit() {
    this.loadingDeals = true;
    this.loadingFoodbanks = true;
    this.showFoodbanks = true;

    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        this.user = userProfile;
      }
    });

    this.buisnessService.getBuisnessesNearLocation(this.user.location).then(() => {
      console.log("done");
    })

    this.buisnessService.getCategoryBuisnesses(5, 'foodbank').then((data) => {
      console.log("got foodbanks", data)
      this.foodbanks = data;
      this.loadingFoodbanks = false;
    })

    this.postService.getDeals(5).then((dealsData) => {
      this.deals = dealsData;
      console.log("got thne deals", dealsData)
      this.loadingDeals = false;
    })

    // Getting Buisness Data from Buisness Feed Service
  }



  toggleShowFoodbanks() {
    console.log("toggled foodbanks")
    this.showFoodbanks = !this.showFoodbanks;
  }


  // loadGeoFire(){
  //   const geoFire = new GeoFirestore(firebase.default.firestore())  
  //   geoFire.collection("RetailersCoords")
  // }

  async openBuisness(buisness: User) {
    const modal = await this.modalController.create({
      component: ViewBuisnessComponent,
      cssClass: 'modal-view',
      swipeToClose: true,
      componentProps: {
        buisness: buisness
      },
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  async openPost(post: Post){
    const modal = await this.modalController.create({
      component: ViewDealComponent,
      cssClass: 'modal-view',
      swipeToClose: true,
      componentProps: {
        post: post
      },
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  getLocation(location: Location){
      let result = `${location.subThoroughfare} ${location.thoroughfare}, ${location.subLocality}`;
      return result;
  }

  getSubLocation(location: Location){
      let result = `${location.locality} ${location.administrativeArea}, ${location.postalCode}`;
      return result;
  }


}
