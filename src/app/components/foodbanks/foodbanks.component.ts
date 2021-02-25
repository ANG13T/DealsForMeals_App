import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewBuisnessComponent } from '../view-buisness/view-buisness.component';
import { IonRouterOutlet } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';
import { IonInfiniteScroll } from '@ionic/angular';
import * as firebase from "firebase";
import { filter } from 'rxjs/internal/operators/filter';
import { take } from 'rxjs/internal/operators/take';



@Component({
  selector: 'app-foodbanks',
  templateUrl: './foodbanks.component.html',
  styleUrls: ['./foodbanks.component.scss'],
})
export class FoodbanksComponent implements OnInit {



  foodbanks: User[];
  deals: Post[];
  loadPosts: any[] = [{ id: 1, imageLoaded: false }, { id: 2, imageLoaded: false }, { id: 3, imageLoaded: false }]
  loadDeals: any[] = [];
  loadingFoodbanks: boolean = false;
  loadingDeals: boolean = false;
  showFoodbanks: boolean = true;

  constructor(private buisnessService: BuisnessService, private postService: PostService, private routerOutlet: IonRouterOutlet, private modalController: ModalController) { }

  async ngOnInit() {
    this.loadingDeals = true;
    this.loadingFoodbanks = true;
    // this.buisnessService.getCategoryBuisnesses(5, 'foodbank').then((data) => {
    //   console.log("got foodbanks", data)
    //   this.foodbanks = data;
    //   this.loadingFoodbanks = false;
    // })

    // Getting Buisness Data from Buisness Feed Service
   
  }



  toggleShowFoodbanks() {
    this.showFoodbanks = !this.showFoodbanks;
  }

  setLoadDeals() {
    this.deals.forEach((deal) => {
      this.loadDeals.push({ showImage: false, deal: deal });
    })
  }


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



}
