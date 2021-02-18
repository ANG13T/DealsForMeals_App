import { Component, OnInit } from '@angular/core';
import { FoodbankService } from 'src/app/shared/services/foodbank.service';


@Component({
  selector: 'app-foodbanks',
  templateUrl: './foodbanks.component.html',
  styleUrls: ['./foodbanks.component.scss'],
})
export class FoodbanksComponent implements OnInit {

  constructor(private foodbankService: FoodbankService) { }

  ngOnInit() {}

  

}
