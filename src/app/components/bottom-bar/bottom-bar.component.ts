import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { CreatePostComponent } from '../modals/create-post/create-post.component';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./bottom-bar.component.scss'],
})
export class BottomBarComponent implements OnInit {

  user: User;
  selectedPath: string;

  constructor(public modalController: ModalController, private userService: UserService, private router: Router) {
    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        this.user = userProfile;
      }
    });

    this.router.events.subscribe((event: RouterEvent) => {
      if(event && event.url){
        this.selectedPath = event.url;
      }
    });
   }

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: CreatePostComponent,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss()
    .then((data) => {
      console.log("got the data", data)
      if(data.data.status == "create"){
        //send create event to profile
        // this.posts.push(data.data.data);
      }
    });

    return await modal.present();
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

}
