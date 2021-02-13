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
  errors = {password: "", name: "", email: ""};

  constructor(private router: Router, private userService: UserService) {
    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        console.log(userProfile)
        this.userProfile.name = userProfile.name;
        this.userProfile.email = userProfile.email;
        this.userProfile.photoURL = userProfile.photoURL;
        this.userProfile.accountType = userProfile.accountType;
      }
    })
  }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

}
