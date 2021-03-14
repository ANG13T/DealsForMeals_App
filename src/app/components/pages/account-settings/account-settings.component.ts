import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {

  user: User;

  constructor(private navCtrl: NavController, private userService: UserService, public alertController: AlertController) { }

  ngOnInit() {
    this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.user = userProfile;
      }
    })
  }

  goBack(){
    this.navCtrl.back();
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: 'Are you sure? This action is <strong>irreversible</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: async() => {
            console.log('Confirm Okay');
            await this.userService.deleteUser(this.user);
          }
        }
      ]
    });

    await alert.present();
  }


}
