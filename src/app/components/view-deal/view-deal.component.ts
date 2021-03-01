import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';
import { AlertController } from '@ionic/angular';
import { PostService } from 'src/app/shared/services/post.service';
import { EditPostComponent } from '../modals/edit-post/edit-post.component';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-view-deal',
  templateUrl: './view-deal.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view-deal.component.scss'],
})
export class ViewDealComponent implements OnInit {

  post: Post;
  origin: string;
  postID: string;
  isOwner: boolean = false;
  uid: string;

  constructor(private router: Router, private route: ActivatedRoute, private modalController: ModalController, public alertController: AlertController, private postService: PostService, public actionSheetController: ActionSheetController, private userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.uid = userProfile.uid;
      }
    })
    this.route.params.subscribe(params => {
      if(this.post == null){
        this.postID = params['id']; 
        //get post data
      }

      this.isOwner = (this.post.userProfile.uid == this.uid);
    });
  }

  dismissModal(status?: string, post?: Post){
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
        console.log("got the data", data)
        if(data.data.status == "edit"){
          this.post = data.data.data;
        }
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
            this.postService.deleteDeal(this.post.id).then(() => {
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
      header: 'Post Actions',
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
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }


}