import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {

  user: User;

  constructor(private alertController: AlertController, private userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe((userProfile)=> {
      if(userProfile){
        this.user = userProfile;
      }
    })
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: 'Are you sure? This action is <strong>irreversible</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
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
