import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Post } from 'src/app/shared/models/post.model';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { PostService } from 'src/app/shared/services/post.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Location } from '../../../shared/models/location.model';
import { ViewDealComponent } from '../../modals/view-deal/view-deal.component';

@UntilDestroy()
@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})
export class DealsComponent implements OnInit {

  deals: Post[] = [];
  user: User;
  loadingDeals: boolean = false;
  searchTerm: string = "";
  topDisplay: Post[];
  bottomDisplay: Post[];

  constructor(private postService: PostService, private modalController: ModalController, private userService: UserService) { }

  async ngOnInit() {
    this.loadingDeals = true;

    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        this.user = userProfile;
        console.log("got user", userProfile);

        this.postService.getDealsNearLocation(this.user.location).then((result) => {
          console.log("resultant deals", result)
          this.deals = result;
          let results = this.deals;
          this.topDisplay = results.slice(0, 5);
          this.bottomDisplay = results.slice(5, this.deals.length);
          this.loadingDeals = false;
        })
      }
    });

  }

  async openDeal(post: Post){
    const modal = await this.modalController.create({
      component: ViewDealComponent,
      componentProps: {
        post: post
      }
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
