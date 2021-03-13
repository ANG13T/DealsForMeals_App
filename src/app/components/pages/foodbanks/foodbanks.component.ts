import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewBuisnessComponent } from '../../modals/view-buisness/view-buisness.component';
import { IonRouterOutlet } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { ViewDealComponent } from '../../modals/view-deal/view-deal.component';
import * as firebase from 'firebase/app';
import { Location } from 'src/app/shared/models/location.model';
import { UserService } from 'src/app/shared/services/user.service';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-foodbanks',
  templateUrl: './foodbanks.component.html',
  styleUrls: ['./foodbanks.component.scss'],
})
export class FoodbanksComponent implements OnInit {

  buisnesses: User[];
  user: User;
  loadingBuisnesses: boolean = false;
  search: boolean = false;
  filter: boolean = false;
  buisnessOptions = ["Foodbanks", "Restaurants", "Other"];

  categoryControl = new FormControl(['Foodbanks']);

  chipsControlValue$ = this.categoryControl.valueChanges;

  disabledControl = new FormControl(false);

  constructor(private buisnessService: BuisnessService, private modalController: ModalController, private userService: UserService) { }

  async ngOnInit() {
    this.loadingBuisnesses = true;


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
        this.buisnessService.getBuisnessesNearLocation(this.user.location).then((result) => {
          console.log("done with result", result);
          this.buisnesses = result;
          this.loadingBuisnesses = false;
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


  async openBuisness(buisness: User) {
    const modal = await this.modalController.create({
      component: ViewBuisnessComponent,
      componentProps: {
        buisness: buisness
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
