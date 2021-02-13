import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreatePostComponent } from '../modals/create-post/create-post.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  user: User;
  loading: boolean = true;
  isFoodbank: boolean = false;

  constructor(private userService: UserService, private router: Router, public modalController: ModalController) { }

  ngOnInit() {
    this.loading = true;
    this.userService.user$.subscribe(async (userProfile) => {
      if(!userProfile) return;
      this.user = userProfile;
      if(this.user.accountType == "foodbank"){
        this.isFoodbank = true;
      }else{
        this.isFoodbank = false;
      }
      this.loading = false;
    });
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  logOut(){
    this.userService.signOut();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CreatePostComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}
