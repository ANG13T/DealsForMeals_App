import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-share-rate',
  templateUrl: './share-rate.component.html',
  styleUrls: ['./share-rate.component.scss'],
})
export class ShareRateComponent implements OnInit {
  stars: boolean[] = [true, true, true, true, true];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  goBack(){
    this.navCtrl.back();
  }

  toggleStar(index){
    let amount = index + 1;
    for(let i = 0; i < amount; i++){

    }

    // for)
  }

}
