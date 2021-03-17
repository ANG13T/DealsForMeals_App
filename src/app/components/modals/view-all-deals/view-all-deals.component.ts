import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';
import { Location } from 'src/app/shared/models/location.model';
import { ViewDealComponent } from '../view-deal/view-deal.component';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { PostService } from 'src/app/shared/services/post.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-view-all-deals',
  templateUrl: './view-all-deals.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view-all-deals.component.scss'],
})
export class ViewAllDealsComponent implements OnInit {

  deals: Post[];
  isOwner: boolean = false;

  constructor(private modalController: ModalController, private alertController: AlertController, private postService: PostService, private userService: UserService) { }

  ngOnInit() { 
    this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.isOwner = (this.deals[0].userProfile.uid == userProfile.uid); //check if is owner because all deals will have same userProfile.uid
      }
    })
  }

  dismissModal() {
    this.modalController.dismiss();
  }


  getLocation(location: Location) {
    let result = `${location.subThoroughfare} ${location.thoroughfare}, ${location.subLocality}`;
    return result;
  }

  getSubLocation(location: Location) {
    let result = `${location.locality} ${location.administrativeArea}, ${location.postalCode}`;
    return result;
  }

  viewDescription(description: string) {
    if (description.length > 35) {
      let result = description.trim().substr(0, 35).concat("...");
      return result;
    }
    return description.trim();
  }

  async presentDeal(deal: Post){
    const modal = await this.modalController.create({
      component: ViewDealComponent,
      componentProps: { 
        origin: 'profile',
        post: deal,
        isOwner: true
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log("got the data", data)
        if(data.data.status == "delete"){
          this.deals = this.deals.filter((el) => {el.id != data.data.data.id});
        }
    });
  }


  async updateDeal(deal: Post){
    const modal = await this.modalController.create({
      component: EditPostComponent,
      cssClass: 'my-custom-class',
      componentProps: { 
        post: deal
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log("got the data", data)
        console.log(data.role)
        let updatedDeal = data.data.data;
        let restDeals = this.deals.filter(deal => deal.id != updatedDeal.id);
        restDeals.push(updatedDeal);
        this.deals = restDeals;
    });

    return await modal.present();
  }

  async deleteDeal(deal: Post) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure?',
      message: 'Deleting this post is <strong>irreversible</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          handler: () => {
            console.log('Confirm Okay');
            this.postService.deleteDeal(deal).then(() => {
              this.deals = this.deals.filter(data => data.id != deal.id);
            })
          }
        }
      ]
    });

    await alert.present();
  }
}
