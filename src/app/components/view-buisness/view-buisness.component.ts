import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import {ActivatedRoute, Router} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { ViewPostComponent } from '../view-post/view-post.component';
declare var google: any;

@Component({
  selector: 'app-view-buisness',
  templateUrl: './view-buisness.component.html',
  styleUrls: ['./view-buisness.component.scss'],
})
export class ViewBuisnessComponent implements OnInit {

  buisness: User;
  posts: Post[] = [];
  shownItem: string = 'deals';

  map: any;
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

  constructor(private buisnessService: BuisnessService, private route:ActivatedRoute, private router: Router, private modalCtrl: ModalController, private postService: PostService, private modalController: ModalController) { }

  ngOnInit() {
    if(!this.buisness){
      let buisnessID = this.route.snapshot.params['id'];
      this.buisnessService.getBuisnessByID(buisnessID).then((buisness) => {
        this.buisness = buisness;

      })
    }

   

    this.postService.getDealsForUser(this.buisness.uid).then((postData) => {
      console.log("got the posts", postData)
      this.posts = postData;
    })
  }

  ionViewDidEnter(){
    this.showMap();
  }

  async presentPost(post: Post){
    const modal = await this.modalController.create({
      component: ViewPostComponent,
      cssClass: 'my-custom-class',
      componentProps: { 
        origin: 'profile',
        post: post,
        isOwner: true
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log("got the data", data)
        if(data.data.status == "delete"){
          this.posts = this.posts.filter((el) => {el.id != data.data.data.id});
        }
    });

    return await modal.present();
  }

  showMap(){
    console.log("showing the map");
    const location = new google.maps.LatLng(-17.824858, 31.053208);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

   dismissModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
