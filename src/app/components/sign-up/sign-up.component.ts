import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Location } from 'src/app/shared/models/location.model';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  name: string = "";
  location: Location = {name: "", longtude: 0, latitude: 0} as Location;
  email: string = "";
  password: string = "";
  isBusiness: boolean = false;
  accountType : 'foodie' | 'foodbank' | 'resturant' | 'other' = "foodbank";
  errors = {password: "", name: "", email: "", location: ""};

  constructor(private router: Router, private userService: UserService, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) { }

  ngOnInit() {
    this.location.name = "-- Choose a Location --";
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  resetState(){
    this.name = "";
    this.email = "";
    this.password = "";
    this.accountType = "foodbank";
    this.errors.password = "";
    this.errors.name = "";
    this.errors.email = "";
    this.errors.location = "";
  }

  selectType(type: string){
    console.log("clicked", type);

    if(type == 'business'){
      this.isBusiness = true;
    }else{
      this.isBusiness = false;
      this.accountType = "foodie";
    }
    
  }

  async collectLocation(){
    this.getLocation().then(() => {
      this.getAddress(this.location.latitude, this.location.longtude).then(() => {
        return;
      }).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  async getLocation(){
    await this.geolocation.getCurrentPosition().then(async(res) => {
      console.log(res);
      this.location.latitude = res.coords.latitude;
      this.location.longtude = res.coords.longitude;
      await this.getAddress(res.coords.latitude, res.coords.longitude);
    }).catch((err) => {
      console.log(err);
    })
  }

  async getAddress(lat: number, long: number){
    this.nativeGeocoder.reverseGeocode(lat, long)
    .then((result: NativeGeocoderResult[]) => {
      console.log(JSON.stringify(result[0]))
      let resultLocation = result[0];
      let address = `${resultLocation.subThoroughfare}, ${resultLocation.subLocality} ${resultLocation.locality}, ${resultLocation.administrativeArea} ${resultLocation.postalCode}, ${resultLocation.countryCode}`;
      console.log("addess ", address)
      this.location.name = address;
    })
    .catch((error: any) => console.log(error));
  }



  async signUp(){
    console.log("signing up")
    if(this.validateForm()){
      let newUser : User = {
        name: this.name,
        uid: '',
        location: { latitude: this.location.latitude, longtude: this.location.longtude, name: this.location.name } as Location,
        accountType: this.accountType,
        email: this.email,
        photoURL: '',
        isBusiness: this.isBusiness
      }

      if(newUser == null){
        alert("Something went wrong.");
        this.resetState();
      }


      let validUser = await this.userService.checkUserExsists(newUser).then((result) => {
         if(!result){
          alert("User already exsists. Please log in.");
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })

      console.log("is valid user", validUser)

      if(validUser){
        await this.userService.signUp(newUser, this.password).then((data) => {
          console.log("got back data", data)
          if(data){
          
            if(data.code == "auth/email-already-in-use"){
              alert("User already created. Please sign in");
              this.email = "";
              this.password = "";
              this.navigate('login');
            }else if(data.code == "auth/weak-password"){
              this.password = "Weak Password";
            }else{
              alert(data.message);
            }
          }
        });
      }
    }
  }

  validateForm(): boolean{
    let result = true;
    if(this.name.length > 30){
      this.errors.name = "Name must be shorter than 30 letters";
      result = false;
    }

    if(this.name.length < 5){
      this.errors.name = "Name must be longer than 5 letters";
      result = false;
    }

    if(!this.validateEmail(this.email)){
      this.errors.email = "Invalid Email";
      result = false;
    }

    if(this.password.length < 5){
      this.errors.password = "Password must be longer than 4 letters";
      result = false;
    }

    return result;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  validateSecond(){
    return (this.name != "") && (this.email != "") && (this.password != "");
  }



}
