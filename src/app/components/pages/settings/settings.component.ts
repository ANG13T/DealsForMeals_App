import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  user: User;

  constructor(private router: Router, private userService: UserService, private navCtrl: NavController, private alertController: AlertController) { }

  ngOnInit() {
    this.userService.user$.subscribe((userProfile)=> {
      if(userProfile){
        this.user = userProfile;
      }
    })
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
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


  logOut(){
    this.userService.signOut();
  }

}
