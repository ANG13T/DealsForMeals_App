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
  zoom: number = 11;
  defaultSheetState = SheetState.Docked;
  loading: boolean = true;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;


  constructor(private businessService: BuisnessService, private userService: UserService, private routerOutlet: IonRouterOutlet, private modalController: ModalController) {
  }

  ngOnInit() {
    this.loading = true;
    this.userService.user$.subscribe((userProfile) => {
      if (userProfile) {
        this.user = userProfile;

        this.businessService.getBuisnessesNearLocation(this.user.location).then((result) => {
          this.buisnesses = result;
          this.loading = false;
        })
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

getSubLocation(location: Location){
    let result = `${location.locality} ${location.administrativeArea}, ${location.postalCode}`;
    return result;
}

}
