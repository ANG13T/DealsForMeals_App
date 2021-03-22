import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

@Component({
  selector: 'app-share-rate',
  templateUrl: './share-rate.component.html',
  styleUrls: ['./share-rate.component.scss'],
})
export class ShareRateComponent implements OnInit {
  stars: boolean[] = [true, true, true, true, true];

  constructor(private navCtrl: NavController, private socialSharing: SocialSharing, private appRate: AppRate) { }

  ngOnInit() {
    this.appRate.preferences = {
      displayAppName: 'App Rate Demo',
      promptAgainForEachNewVersion: true,
      storeAppURL:{
        ios: '< my_app_id >', 
        android: 'market://details?id=yourapp.package.name'
      },
      customLocale: {
        title: 'Do you enjoy DealsForMeals?',
        message: 'If you enjoy DealsForMeals. would you mind talking to rate it?',
        cancelButtonLabel: 'No, Thanks',
        laterButtonLabel: 'Remind Me Later',
        rateButtonLabel: 'Rate It Now'
      },
      callbacks:{
        onRateDialogShow: function(callback) {
          console.log('User Prompt for Rating');
        },
        onButtonClicked: function(buttonIndex){
          console.log('Selected Button Index',buttonIndex);
        }
      }
    }
  }

  goBack(){
    this.navCtrl.back();
  }

  otherShare(){
    let options = {
      message: 'Download DealsForMeals on the App Store', // not supported on some apps (Facebook, Instagram)
      subject: 'Download DealsForMeals on the App Store', // fi. for email
      url: 'https://angelina-tsuboi.github.io/DealsForMeals/'
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

  showRatePrompt(){
    this.appRate.preferences.storeAppURL = {
      //ios: '< my_app_id >',
      android: 'market://details?id=com.hsa.followup.happyspoon'
      //windows: 'ms-windows-store://review/?ProductId=< Store_ID >'
      };
  
      this.appRate.promptForRating(true); 
  }

}
