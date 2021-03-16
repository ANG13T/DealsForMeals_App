import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ViewBuisnessComponent } from '../../modals/view-buisness/view-buisness.component';
import { Location } from '../../../shared/models/location.model';
import { SheetState } from 'ion-bottom-sheet';

declare var google: any;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {

  map: any;
  user: User;
  buisnesses: User[] = [];
  searchTerm: string;
  zoom: number = 11;
  selectedIndicators: string = "all";
  defaultSheetState = SheetState.Docked;
  loading: boolean = true;
  toggledFoodbanks: boolean = false;
  toggledRestaurants: boolean = false;
  toggledOthers: boolean = false;
  userLocation: Location = null;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;


  constructor(private businessService: BuisnessService, private userService: UserService, private routerOutlet: IonRouterOutlet, private modalController: ModalController) {
  }

  ngOnInit() {
    this.loading = true;
    this.userService.user$.subscribe((userProfile) => {
      if (userProfile) {
        this.user = userProfile;

        if(this.user.accountType == "foodie"){
          this.userService.location$.subscribe((locationInfo) => {
            if(locationInfo){
              this.userLocation.latitude = locationInfo.coords.latitude;
              this.userLocation.longitude = locationInfo.coords.longitude;
            }
          })
          
        }

        let resultantLocation = this.userLocation ? this.userLocation : this.user.location;
        
          this.businessService.getBuisnessesNearLocation(resultantLocation).then((result) => {
            this.buisnesses = result;
            this.loading = false;
          });
      }
    })
  }


  async openBuisnessDialog(buisness: User) {
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


  getLocation(location: Location){
    let result = `${location.subThoroughfare} ${location.thoroughfare}, ${location.subLocality}`;
    return result;
  }

  toggleIndicators(indicator: string){
    if(indicator == "others"){
      this.toggledOthers ? this.selectedIndicators = "all" : this.selectedIndicators = "others";
      this.toggledOthers = !this.toggledOthers;
      this.toggledFoodbanks = false;
      this.toggledRestaurants = false;
    }

    if(indicator == "foodbanks"){
      this.toggledFoodbanks ? this.selectedIndicators = "all" : this.selectedIndicators = "foodbanks";
      this.toggledFoodbanks = !this.toggledFoodbanks;
      this.toggledOthers = false;
      this.toggledRestaurants = false;
    }

    if(indicator == "restaurants"){
      this.toggledRestaurants ? this.selectedIndicators = "all" : this.selectedIndicators = "restaurants";
      this.toggledRestaurants = !this.toggledRestaurants;
      this.toggledOthers = false;
      this.toggledFoodbanks = false;
    }
  }

getSubLocation(location: Location){
    let result = `${location.locality} ${location.administrativeArea}, ${location.postalCode}`;
    return result;
}

}
