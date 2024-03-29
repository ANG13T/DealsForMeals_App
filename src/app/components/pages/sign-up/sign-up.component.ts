import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Location } from 'src/app/shared/models/location.model';
import { FormGroup } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import * as geofire from 'geofire-common';
import { MapsAPILoader } from '@agm/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

interface AddressInfo {
  postalCode: string;
  administrativeArea: string;
  countryCode: string;
  locality: string;
  subAdministrativeArea: string;
  subLocality: string;
  subThoroughfare: string;
  thoroughfare: string;
} 

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  loading: boolean = false;
  name: string = "";
  placesText: string = "";
  firstName: string = "";
  lastName: string = "";
  location: Location = { fullAddress: "", longitude: 0, latitude: 0, locality: "", subLocality: "", thoroughfare: "", subThoroughfare: "", administrativeArea: "", subAdministrativeArea: "", postalCode: "", countryCode: "" } as Location;
  email: string = "";
  password: string = "";
  isBusiness: boolean = false;
  accountType: 'foodie' | 'foodbank' | 'resturant' | 'other' = "foodie";
  errors = { password: "", name: "", email: "", location: "" };

  // Location Variables
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  options={
    componentRestrictions:{
      country: ["us", "ca"]
    },
    fields: ["address_components", "geometry", "formatted_address"],
    types: ["address"]
  }


  constructor(private router: Router, private userService: UserService, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, public zone: NgZone, private mapsAPILoader: MapsAPILoader) { 

  }

  ngOnInit() {
    this.loading = false;
  }

  navigate(route: string) {
    this.router.navigate([`/${route}`]);
  }

  resetState() {
    this.firstName = "";
    this.lastName = "";
    this.name = "";
    this.email = "";
    this.password = "";
    this.accountType = "foodbank";
    this.errors.password = "";
    this.errors.name = "";
    this.errors.email = "";
    this.errors.location = "";
  }

  changeName(content: string, identifier: string) {
    if (identifier == "first") {
      this.firstName = content;
    } else {
      this.lastName = content;
    }

    this.name = `${this.firstName} ${this.lastName}`;
  }

  selectType(type: string) {
    console.log("clicked", type);

    if (type == 'business') {
      this.isBusiness = true;
      this.accountType = "foodbank";
    } else {
      this.isBusiness = false;
      this.accountType = "foodie";
    }

  }

  public handleAddressChange(address: Address) {
    console.log("the adress", address);
    console.log("the adress", address.adr_address);
    console.log("the adress", address.formatted_address);
    let long = address.geometry.location.lng();
    let lat = address.geometry.location.lat();
    try{
      let addressInfo = this.getAddressInfo(address.address_components);
      this.location = { fullAddress: address.formatted_address, longitude: long, latitude: lat, locality: addressInfo.locality, subLocality: addressInfo.subLocality, thoroughfare: addressInfo.thoroughfare, subThoroughfare: addressInfo.subThoroughfare, administrativeArea: addressInfo.administrativeArea, subAdministrativeArea: addressInfo.subAdministrativeArea, postalCode: addressInfo.postalCode, countryCode: addressInfo.countryCode } as Location;
    }catch(err){
      this.placesText= "";
      alert("Invalid Location. Please try again");
    }
   
  }

  async signUp() {
    if (this.validateForm()) {
      console.log("the location for validation is: ", this.location);
      let newUser: User = {
        name: this.name,
        uid: '',
        location: this.location,
        lat: this.location.latitude,
        lng: this.location.longitude,
        hash: geofire.geohashForLocation([this.location.latitude, this.location.longitude]),
        accountType: this.accountType,
        email: this.email,
        photoURL: '',
        isBusiness: this.isBusiness,
        upvotes: [],
        downvotes: []
      }

      if (newUser == null) {
        alert("Something went wrong.");
        this.resetState();
      }


      let validUser = await this.userService.checkUserExsists(newUser).then((result) => {
        if (!result) {
          alert("User already exsists. Please log in.");
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })

      console.log("is valid user", validUser)

      if (validUser) {
        this.loading = true;
        await this.userService.signUp(newUser, this.password).then((data) => {
          console.log("got back data", data)
          if (data) {

            if (data.code == "auth/email-already-in-use") {
              alert("User already created. Please sign in");
              this.email = "";
              this.password = "";
              this.navigate('login');
            } else if (data.code == "auth/weak-password") {
              this.password = "Weak Password";
            } else {
              alert(data.message);
            }
          }
        });
      }
    }
  }

  async googleSignUp(){
      let newUser: User = {
        name: '',
        uid: '',
        location: this.location,
        lat: this.location.latitude,
        lng: this.location.longitude,
        hash: geofire.geohashForLocation([this.location.latitude, this.location.longitude]),
        accountType: this.accountType,
        email: '',
        photoURL: '',
        isBusiness: this.isBusiness,
        upvotes: [],
        downvotes: []
      }

      await this.userService.googleSignUp(newUser)
      .catch((err) => {
        console.log("err", err);
        alert("Something went wrong: " + err.message);
      })
  }

  validateForm(): boolean {
    let result = true;
    if (this.name.length > 30) {
      this.errors.name = "Name must be shorter than 30 letters";
      result = false;
    }

    if (this.name.length < 5) {
      this.errors.name = "Name must be longer than 5 letters";
      result = false;
    }

    if (!this.validateEmail(this.email)) {
      this.errors.email = "Invalid Email";
      result = false;
    }

    if (this.password.length < 5) {
      this.errors.password = "Password must be longer than 4 letters";
      result = false;
    }

    return result;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  validateSecond() {
    return (this.name != "") && (this.email != "") && (this.password != "");
  }

  //Get current coordinates of device
  getGeolocation() {
    console.log("getting the location");
    this.geolocation.getCurrentPosition().then((resp) => {

      console.log("got the location");

      this.location.latitude = resp.coords.latitude;
      this.location.longitude = resp.coords.longitude;

      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);

    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.location.latitude = latitude;
    this.location.longitude = longitude;
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.location.fullAddress = this.generateAddress(result[0]);
        this.location.fullAddress = this.generateAddress(result[0]);
        this.updateLocation(result[0]);

        console.log("the address", this.location.fullAddress)
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  updateLocation(locationData: NativeGeocoderResult) {
    console.log("the location data", locationData);
    this.location.countryCode = locationData.countryCode;
    this.location.postalCode = locationData.postalCode;
    this.location.administrativeArea = locationData.administrativeArea;
    this.location.subAdministrativeArea = locationData.subAdministrativeArea;
    this.location.locality = locationData.locality;
    this.location.subLocality = locationData.subLocality;
    this.location.thoroughfare = locationData.thoroughfare;
    this.location.subThoroughfare = locationData.subThoroughfare;
  }

  filterType(type: string, data: any[]){
    var result = data.find(obj => {
      return obj.types.includes(type);
    })
    return result;
  }

  // get address places info
  getAddressInfo(data: any[]){
    let subthroughfare = this.filterType("street_number", data).short_name;
    let throughfare = this.filterType("route", data).short_name;
    let subLocality;
    if(this.filterType("locality", data)){
      subLocality = this.filterType("locality", data).long_name;
    }else{
      subLocality = this.filterType("sublocality", data).long_name;
    }
    
    let locality;
    let subAdministrativeArea;
    if(this.filterType("administrative_area_level_2", data)){
       locality = this.filterType("administrative_area_level_2", data).short_name;
       subAdministrativeArea = this.filterType("administrative_area_level_2", data).long_name;
    }else{
      locality = this.filterType("political", data).short_name;
      subAdministrativeArea = this.filterType("political", data).long_name;
    }
    
    let administrativeArea = this.filterType("administrative_area_level_1", data).short_name;
    let countryCode = this.filterType("country", data).short_name;
    let postalCode = this.filterType("postal_code", data).short_name;
    let addressInfo: AddressInfo = {postalCode: postalCode, subLocality: subLocality, locality: locality, subAdministrativeArea: subAdministrativeArea, countryCode: countryCode, subThoroughfare: subthroughfare, thoroughfare: throughfare, administrativeArea: administrativeArea};
    return addressInfo;
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }

}
