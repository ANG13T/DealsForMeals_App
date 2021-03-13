import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Post } from 'src/app/shared/models/post.model';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { PostService } from 'src/app/shared/services/post.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Location } from '../../../shared/models/location.model';
import { ViewDealComponent } from '../../modals/view-deal/view-deal.component';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss'],
})
export class DealsComponent implements OnInit {

  deals: Post[];
  user: User;
  loadingDeals: boolean = false;
  search: boolean = false;
  filter: boolean = false;
  buisnessOptions = ["Foodbanks", "Restaurants", "Other"];

  categoryControl = new FormControl(['Foodbanks']);

  chipsControlValue$ = this.categoryControl.valueChanges;

  disabledControl = new FormControl(false);

  constructor(private postService: PostService, private modalController: ModalController, private userService: UserService) { }

  async ngOnInit() {
    this.loadingDeals = true;


    this.disabledControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        if (val) this.categoryControl.disable();
        else this.categoryControl.enable();
      });

    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        this.user = userProfile;
        console.log("got user", userProfile);

        this.postService.getDealsNearLocation(this.user.location).then((result) => {
          console.log("resultant deals", result)
          this.deals = result;
          this.loadingDeals = false;
        })
      }
    });

  }


  toggleSearch(){
    this.search = !this.search;
    if(this.search){
      this.filter = false;
    }
  }

  toggleFilter(){
    this.filter = !this.filter;
    if(this.filter){
      this.search = false;
    }
  }


  async openPost(post: Post){
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
