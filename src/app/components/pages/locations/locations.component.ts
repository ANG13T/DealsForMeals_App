import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ViewBuisnessComponent } from '../../modals/view-buisness/view-buisness.component';
import { Location } from '../../../shared/models/location.model';
import { SheetState } from 'ion-bottom-sheet';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

declare var google: any;

@UntilDestroy()
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {

  map: any;
  user: User;
  markerImage: string = '../../../../assets/images/buisness-marker.png';
  openedWindow : number = 0;
  buisnesses: User[] = [];
  allBuisnesses: User[] = [];
  searchTerm: string = "";
  mapLongitude: number = 0;
  mapLatitiude: number = 0;
  mapMinHeight: number = 250;
  zoom: number = 11;
  selectedIndicators: string = "all";
  defaultSheetState = SheetState.Docked;
  loading: boolean = true;
  toggledFoodbanks: boolean = false;
  toggledRestaurants: boolean = false;
  toggledOthers: boolean = false;
  userLocation: Location = null;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  buisnessOptions = ["Foodbanks", "Restaurants", "Other"];

  categoryControl = new FormControl(this.buisnessOptions);

  disabledControl = new FormControl(false);

  chipsControlValue$ = this.categoryControl.valueChanges;

  options={
    componentRestrictions:{
      country: ["us", "ca"]
    },
    fields: ["address_components", "geometry"],
    types: ["address"]
  }


  constructor(private businessService: BuisnessService, private userService: UserService, private routerOutlet: IonRouterOutlet, private modalController: ModalController, private loadingController: LoadingController) {
  }

  ngOnInit() {
    this.loading = true;
    this.presentLoading();

    this.disabledControl.valueChanges
    .pipe(untilDestroyed(this))
    .subscribe((val) => {
      if (val) this.categoryControl.disable();
      else this.categoryControl.enable();
    });

    this.userService.user$.subscribe((userProfile) => {
      if (userProfile) {
        this.user = userProfile;

        this.mapLatitiude = this.user.location.latitude;
        this.mapLongitude = this.user.location.longitude;

        if(this.user.accountType == "foodie"){
          this.userService.location$.subscribe((locationInfo) => {
            if(locationInfo){
              this.userLocation.latitude = locationInfo.coords.latitude;
              this.userLocation.longitude = locationInfo.coords.longitude;
              this.mapLatitiude = this.userLocation.latitude;
              this.mapLongitude = this.userLocation.longitude;
            }
          })
          
        }


        this.businessService.buisnesses$.subscribe((buisnesses) => {
          console.log("buisnesses are", buisnesses)
          this.buisnesses = buisnesses;
          this.allBuisnesses = this.buisnesses;
          this.loading = false;
          this.dismissLoading();
        })
        
          // this.businessService.getBuisnessesNearLocation(resultantLocation).then((result) => {
          //   this.buisnesses = result;
          //   this.loading = false;
          //   this.dismissLoading();
          // });
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


  goToMapPosition(latitude: number, longitude: number){
    this.mapLatitiude = latitude;
    this.mapLongitude = longitude;
  }

  public handleAddressChange(address: Address) {
    console.log("the adress", address);
    let long = address.geometry.location.lng();
    let lat = address.geometry.location.lat();
    this.goToMapPosition(lat, long);
    this.getBuisnessesNearLocation(lat, long);
  }

  getBuisnessesNearLocation(lat: number, long: number){
    let location: Location = {latitude: lat, longitude: long, fullAddress: ""};
    this.businessService.getBuisnessesNearLocation(location).then((data) => {
      this.buisnesses = data;
    })
  }

  async dismissLoading(){
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  openWindow(id) {
    if(this.openedWindow == id){
      this.openedWindow = 0;
    }else{
      this.openedWindow = id;
    }  
  }

  isInfoWindowOpen(id) {
    return this.openedWindow == id; 
  }

  async presentLoading() {
    return await this.loadingController.create({
      message: 'Loading',
    }).then(a => {
      a.present().then(() => {
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
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
