import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private navCtrl: NavController) { }

  ngOnInit() {
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  goBack(){
    this.navCtrl.back();
  }

  openExternalURL(url: string){
    window.location.assign(url);
  }


  logOut(){
    this.userService.signOut();
  }

}
