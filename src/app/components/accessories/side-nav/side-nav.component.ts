import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { menuController } from "@ionic/core";
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {

  user: User;
  userServiceSubscription: Subscription;

  constructor(private router: Router, private userService: UserService) { 
    this.userServiceSubscription = new Subscription();
  }

  ngOnInit() {
    this.userServiceSubscription = this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.user = userProfile;
      }
    })
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
    menuController.toggle();
  }

  logOut(){
    this.userServiceSubscription.unsubscribe();
    this.userService.signOut();
    menuController.toggle();
  }

}
