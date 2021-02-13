import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {}

  dismissModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

}
