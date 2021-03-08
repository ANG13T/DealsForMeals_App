import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 

declare var google: any;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  
  map: any;

  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

  
  constructor() { }

  ionViewDidEnter(){
    this.showMap();
  }
 

  ngOnInit() {
  }

  showMap(){
    const location = new google.maps.LatLng(-17.824858, 31.053208);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

  }

}
