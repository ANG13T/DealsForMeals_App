import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-view-all-deals',
  templateUrl: './view-all-deals.component.html',
  styleUrls: ['./view-all-deals.component.scss'],
})
export class ViewAllDealsComponent implements OnInit {

  deals: Post[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
