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

    //marked star
    for(let i = 0; i < amount; i++){
      this.stars[i] = true;
    }

    //unmarked star.
    for(let i = 5; i > amount; i--){
      this.stars[i - 1] = false;
    }
  }

  otherShare(){
    console.log("sharing...")
    let options = {
      message: 'Download DealsForMeals on the App Store', // not supported on some apps (Facebook, Instagram)
      subject: 'Download DealsForMeals on the App Store', // fi. for email
      url: 'https://example.com/',
      chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
  }
  this.socialSharing.shareWithOptions(options).then((result) => {
      console.log("Share completed? ", result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: ", result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  }, (err) => {
      console.log("Sharing failed with message: ", err);
  });
  }

  instaShare(){
    this.socialSharing.shareViaTwitter("Download DealsForMeals from the App Store", null, null).then(() => {
      console.log("done")
    }).catch((err) => {
      console.log("error: ", err)
      alert("Please Download Instagram to Share the App.")
    })
  }

  facebookShare(){
    this.socialSharing.shareViaTwitter("Download DealsForMeals from the App Store", null, null).then(() => {
      console.log("done")
    }).catch((err) => {
      console.log("error: ", err)
      alert("Please Download Facebook to Share the App.")
    })
  }

  twitterShare(){
    this.socialSharing.shareViaTwitter("Download DealsForMeals from the App Store", null, null).then(() => {
      console.log("done")
    }).catch((err) => {
      console.log("error: ", err)
      alert("Please Download Twitter to Share the App.")
    })
  }

}
