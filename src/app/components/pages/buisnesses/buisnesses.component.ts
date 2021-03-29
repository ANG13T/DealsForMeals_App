import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { ViewBuisnessComponent } from '../../modals/view-buisness/view-buisness.component';
import { ModalController } from '@ionic/angular';
import { Location } from 'src/app/shared/models/location.model';
import { UserService } from 'src/app/shared/services/user.service';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as geofire from 'geofire-common';
import * as _ from 'lodash';

@UntilDestroy()
@Component({
  selector: 'app-buisnesses',
  templateUrl: './buisnesses.component.html',
  styleUrls: ['./buisnesses.component.scss'],
})
export class BuisnessesComponent implements OnInit {

  buisnesses: User[] = [];
  user: User;
  filter: boolean = false;
  searchTerm:string = "";
  loadingBuisnesses: boolean = false;
  buisnessOptions = ["Foodbanks", "Restaurants", "Other"];

  categoryControl = new FormControl(this.buisnessOptions);

  chipsControlValue$ = this.categoryControl.valueChanges;

  disabledControl = new FormControl(false);

  constructor(private buisnessService: BuisnessService, private modalController: ModalController, private userService: UserService) { }

  buisnesses$ = this.buisnessService.buisnesses$;

  async ngOnInit() {
    this.loadingBuisnesses = true;
    this.filter = false;

    this.disabledControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        if (val) this.categoryControl.disable();
        else this.categoryControl.enable();
      });

    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        this.user = userProfile;
        // this.buisnessService.getBuisnessesNearLocation(this.user.location).then((result) => {
        //   this.buisnesses = result;
        //   this.loadingBuisnesses = false;
        // })
        this.buisnessService.getBuisnesses(10).then((data) => {
          this.buisnesses = data;
          this.loadingBuisnesses = false;
        })
      }
    });

  }

  // onScroll () {
  //   console.log("scroll more")
  //   setTimeout(() => {
  //     this.fetchBuisnessesPaginated();
  //   }, 1500);
  // }

  toggleFilter(){
    this.filter = !this.filter;
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

  getDistanceBetweenBuisness(buisness: User): number{
    let center = [this.user.location.latitude, this.user.location.longitude];
    const lat = buisness.location.latitude;
    const lng = buisness.location.longitude;
    const distanceInKm = geofire.distanceBetween([lat, lng], center);
    const distanceInM = distanceInKm * 1000;
    const distanceInMiles = distanceInM / (0.000621371);
    return distanceInMiles;
  }

  getAccountIcon(accountType: string){
    if(accountType == "foodbank"){
      return "fast-food";
    }

    if(accountType == "other"){
      return "business";
    }

    return "storefront";
  }

  // alreadyContainsBuisness(user: User){
  //   for(let pageBuisness of this.paginationBuisnesses){
  //     if(pageBuisness.uid == user.uid){
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // fetchBuisnessesPaginated () {
  //   console.log("paginate")
  //   this.loadingBuisnesses = true;
  //   this.userService.paginate(this.batch, this.last).pipe(
  //     map(data => {
  //       console.log("gottem data", data);
  //       if ( !data.length) {
  //         this.empty = true;
  //       }
  //       let last = _.last(data);
  //       if (last) {
  //         this.last = last.payload.doc.data().createdAt;
  //         data.map(todoSnap => {
  //           let resultData = todoSnap.payload.doc.data();
  //           let id = todoSnap.payload.doc.id;
  //           resultData.id = id;
  //           let result = {...resultData} as User;
  //           if(!this.alreadyContainsBuisness(result)){
  //             this.paginationBuisnesses.push(result);
  //           }else{
  //             if(data.length == 1){
  //               this.empty = true;
  //             }
  //           }
  //         })

  //         console.log("done", this.paginationBuisnesses)
  //         this.loadingBuisnesses = false;
  //       }
  //     })
  //   ).subscribe();
  // }


}
