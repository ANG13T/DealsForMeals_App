import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-view-buisness',
  templateUrl: './view-buisness.component.html',
  styleUrls: ['./view-buisness.component.scss'],
})
export class ViewBuisnessComponent implements OnInit {

  @Input() buisness: User;

  constructor() { }

  ngOnInit() {
    if(!this.buisness){
      // get data from id
    }
  }

}
