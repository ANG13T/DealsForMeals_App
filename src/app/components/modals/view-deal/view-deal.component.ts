import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Deal } from 'src/app/shared/models/deal.model';
import { AlertController } from '@ionic/angular';
import { DealService } from 'src/app/shared/services/deal.service';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { UserService } from 'src/app/shared/services/user.service';
import { SendEmailComponent } from '../send-email/send-email.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-view-deal',
  templateUrl: './view-deal.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view-deal.component.scss'],
})
export class ViewDealComponent implements OnInit {

  post: Deal;
  beforeEditPost: Deal;
  origin: string;
  postID: string;
  displayLocation: string;
  isOwner: boolean = false;
  currentUser: User;
  uid: string;
  upvoted: boolean = false;
  downvoted: boolean = false;
  selectedIndex: string = "description";

  constructor(private router: Router, private modalController: ModalController, public alertController: AlertController, private dealService: DealService, public actionSheetController: ActionSheetController, private userService: UserService, private dialog: MatDialog) { }

  ngOnInit() {
    this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.currentUser = userProfile;
        this.uid = userProfile.uid;
        this.isOwner = (this.post.userProfile.uid == this.uid);
        let location = this.post.userProfile.location;
        this.displayLocation = `${location.subThoroughfare} ${location.thoroughfare}, ${location.subLocality} ${location.locality}, ${location.administrativeArea}`;
      }
    });
  }

  dismissModal(status?: string, post?: Deal){
    this.modalController.dismiss({
      'dismissed': true,
      status: status,
      data: post
    });
  }



  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  async editPost(){
    const modal = await this.modalController.create({
      component: EditPostComponent,
      cssClass: 'my-custom-class',
      componentProps: { 
        post: this.post
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.post = data.data.data;
    });

    return await modal.present();
  }

  async confirmDelete() {
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
            this.dealService.deleteDeal(this.post).then(() => {
              this.dismissModal('delete', this.post);
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Deal Actions',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Edit Post',
        icon: 'create-outline',
        handler: () => {
          this.editPost()
        }
      }, {
        text: 'Delete Post',
        icon: 'trash-outline',
        handler: () => {
          this.confirmDelete();
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }


  contactBuisness(){
    this.dialog.open(SendEmailComponent, {
      width: '350px',
      data: {buisness: this.post.userProfile, sent: this.currentUser}
    });
  }


  downvote(){
    console.log("dowsnvote")
    if(this.upvoted){
      this.upvoted =  false;
    }
    this.downvoted = !this.downvoted;
  }

  upvote(){
    if(this.downvoted){
      this.downvoted =  false;
    }
    this.upvoted = !this.upvoted;
  }

}
