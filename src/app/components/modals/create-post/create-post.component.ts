import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {

  post: Post = {title: "", description: "", userProfile: null, images: [], amount: 0};

  constructor(private modalController: ModalController, private router: Router, private userService: UserService) { 
    this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.post.userProfile = userProfile;
        this.post.images = ["https://upload.wikimedia.org/wikipedia/commons/2/22/Pacific_Walrus_-_Bull_%288247646168%29.jpg"]
      }
    })
  }

  ngOnInit() {
    
  }

  dismissModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

}
