import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import {ActivatedRoute, Router} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
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

  constructor(private buisnessService: BuisnessService, private route:ActivatedRoute, private router: Router, private modalCtrl: ModalController, private postService: PostService) { }

  ngOnInit() {
    if(!this.buisness){
      let buisnessID = this.route.snapshot.params['id'];
      this.buisnessService.getBuisnessByID(buisnessID).then((buisness) => {
        this.buisness = buisness;
        this.postService.getDealsForUser(buisnessID).then((postData) => {
          this.posts = postData;
        })
      })
    }
  }

  ionViewDidEnter(){
    this.showMap();
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
