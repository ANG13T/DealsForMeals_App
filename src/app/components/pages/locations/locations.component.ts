import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { UserService } from 'src/app/shared/services/user.service';

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

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;


  constructor(private businessService: BuisnessService, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.user$.subscribe((userProfile) => {
      if (userProfile) {
        this.user = userProfile;

        this.businessService.getBuisnessesNearLocation(this.user.location).then((result) => {
          this.buisnesses = result;
        })
      }
    })

  }
}
