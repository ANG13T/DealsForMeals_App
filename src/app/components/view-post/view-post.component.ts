import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';
import { AlertController } from '@ionic/angular';
import { PostService } from 'src/app/shared/services/post.service';
import { EditPostComponent } from '../modals/edit-post/edit-post.component';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
})
export class ViewPostComponent implements OnInit {

  post: Post;
  origin: string;
  postID: string;
  isOwner: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private modalController: ModalController, public alertController: AlertController, private postService: PostService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(this.post == null){
        this.postID = params['id']; 
        //get post data
      }
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
            this.postService.deletePost(this.post.id).then(() => {
              this.dismissModal('delete', this.post);
            })
          }
        }
      ]
    });

    await alert.present();
  }

}
