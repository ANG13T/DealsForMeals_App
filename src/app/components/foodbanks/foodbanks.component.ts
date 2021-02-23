import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewBuisnessComponent } from '../view-buisness/view-buisness.component';
import { IonRouterOutlet } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { MbscFormOptions } from '@mobiscroll/angular-lite';


@Component({
  selector: 'app-foodbanks',
  templateUrl: './foodbanks.component.html',
  styleUrls: ['./foodbanks.component.scss'],
})
export class FoodbanksComponent implements OnInit {

  foodbanks: User[];
  deals: Post[];
  showFoodbanks: boolean = true;

  settings: MbscFormOptions = {
    theme: 'ios',
    themeVariant: 'light'
};

  constructor(private buisnessService: BuisnessService, private postService: PostService, private routerOutlet: IonRouterOutlet, private modalController: ModalController) { }

  ngOnInit() {
    this.buisnessService.getCategoryBuisnesses(5, 'foodbank').then((data) => {
      console.log("got foodbanks", data)
      this.foodbanks = data;
    })

    this.postService.getDeals(5).then((data) => {
      console.log("got deals", data);
      this.deals = data;
    })
  }

  toggleShowFoodbanks(){
    this.showFoodbanks = !this.showFoodbanks;
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
