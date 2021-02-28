import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  logOut(){
    this.userService.signOut();
  }

}
