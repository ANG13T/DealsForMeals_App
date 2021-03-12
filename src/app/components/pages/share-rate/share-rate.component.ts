import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-share-rate',
  templateUrl: './share-rate.component.html',
  styleUrls: ['./share-rate.component.scss'],
})
export class ShareRateComponent implements OnInit {
  stars: boolean[] = [true, true, true, true, true];

  constructor(private navCtrl: NavController, private socialSharing: SocialSharing) { }

  ngOnInit() {}

  goBack(){
    this.navCtrl.back();
  }

  toggleStar(index){
    let amount = index + 1;
    let remaining = 5 - amount;

    //marked star
    for(let i = 0; i < amount; i++){
      this.stars[i] = true;
    }

    //unmarked star.
    for(let i = 5; i > amount; i--){
      this.stars[i - 1] = false;
    }
  }

  messageShare(){

  }

  instaShare(){

  }

  facebookShare(){

  }

  twitterShare(){
    
  }

}
