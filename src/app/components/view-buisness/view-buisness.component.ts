import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { BuisnessService } from 'src/app/shared/services/buisness.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-view-buisness',
  templateUrl: './view-buisness.component.html',
  styleUrls: ['./view-buisness.component.scss'],
})
export class ViewBuisnessComponent implements OnInit {

  @Input() buisness: User;

  constructor(private buisnessService: BuisnessService, private route:ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if(!this.buisness){
      let buisnessID = this.route.snapshot.params['id'];
      this.buisnessService.getBuisnessByID(buisnessID).then((buisness) => {
        this.buisness = buisness;
      })
    }
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

}
