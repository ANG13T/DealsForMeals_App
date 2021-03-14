import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  goBack(){
    this.navCtrl.back();
  }

}
