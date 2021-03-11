import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-share-rate',
  templateUrl: './share-rate.component.html',
  styleUrls: ['./share-rate.component.scss'],
})
export class ShareRateComponent implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  goBack(){
    this.navCtrl.back();
  }

}
