import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { menuController } from "@ionic/core";
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {

  identifier:string;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.identifier = userProfile.accountType;
      }
    })
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
    menuController.toggle();
  }

  logOut(){
    this.userService.signOut();
    menuController.toggle();
  }

}
