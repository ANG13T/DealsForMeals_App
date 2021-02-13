import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userProfile: User = {name: "", email: "", accountType: "foodbank", photoURL: "", uid: "", location: ""};
  initUserProfile: User = {name: "", email: "", accountType: "foodbank", photoURL: "", uid: "", location: ""};
  errors = {password: "", name: "", email: ""};

  constructor(private router: Router, private userService: UserService) {
    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        console.log(userProfile)
        this.userProfile.name = userProfile.name;
        this.userProfile.email = userProfile.email;
        this.userProfile.photoURL = userProfile.photoURL;
        this.userProfile.accountType = userProfile.accountType;

        //init user profile
        this.initUserProfile.name = userProfile.name;
        this.initUserProfile.email = userProfile.email;
        this.initUserProfile.photoURL = userProfile.photoURL;
        this.initUserProfile.accountType = userProfile.accountType;
      }
    })
  }

  editProfile(){
    if(this.validateForm()){
      alert("Completed");
    }
  }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  fieldsDifferent(){
    return JSON.stringify(this.initUserProfile) != JSON.stringify(this.userProfile);
  }

  validateForm(): boolean{
    let result = true;
    if(this.userProfile.name.length > 30){
      this.errors.name = "Name must be shorter than 30 letters";
      result = false;
    }

    if(this.userProfile.name.length < 5){
      this.errors.name = "Name must be longer than 5 letters";
      result = false;
    }

    if(!this.validateEmail(this.userProfile.email)){
      this.errors.email = "Invalid Email";
      result = false;
    }

    return result;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }



}
