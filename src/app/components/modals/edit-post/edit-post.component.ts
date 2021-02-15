import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {

  constructor(private _modalController: ModalController) { }

  ngOnInit() {}

  dismissModal(status?: string, post?: Post){
    this._modalController.dismiss({
      'dismissed': true,
      status: status,
      data: post
    });
  }

}
