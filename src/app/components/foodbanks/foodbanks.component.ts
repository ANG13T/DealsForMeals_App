import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import { PostService } from 'src/app/shared/services/post.service';


@Component({
  selector: 'app-foodbanks',
  templateUrl: './foodbanks.component.html',
  styleUrls: ['./foodbanks.component.scss'],
})
export class FoodbanksComponent implements OnInit {

  foodbanks: User[];
  deals: Post[];
  showFoodbanks: boolean = true;

  constructor(private buisnessService: BuisnessService, private postService: PostService) { }

  ngOnInit() {
    this.buisnessService.getCategoryBuisnesses(5, 'foodbanks').then((data) => {
      console.log("got foodbanks", data)
      this.foodbanks = data;
    })

    this.postService.getDeals(5).then((data) => {
      console.log("got deals", data);
      this.deals = data;
    })
  }

  toggleShowFoodbanks(){
    this.showFoodbanks = !this.showFoodbanks;
  }

  

}
