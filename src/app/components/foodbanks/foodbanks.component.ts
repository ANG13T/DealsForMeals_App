import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { FoodbankService } from 'src/app/shared/services/foodbank.service';


@Component({
  selector: 'app-foodbanks',
  templateUrl: './foodbanks.component.html',
  styleUrls: ['./foodbanks.component.scss'],
})
export class FoodbanksComponent implements OnInit {

  foodbanks: User[];
  showFoodbanks: boolean = true;

  constructor(private foodbankService: FoodbankService) { }

  ngOnInit() {
    this.foodbankService.getFoodbanks(5).then((data) => {
      console.log("got foodbanks", data)
      this.foodbanks = data;
    })
  }

  toggleShowFoodbanks(){
    this.showFoodbanks = !this.showFoodbanks;
  }

  

}
