import { Component, OnInit, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UntilDestroy } from '@ngneat/until-destroy';
import { map } from 'rxjs/internal/operators/map';
import { Deal } from 'src/app/shared/models/deal.model';
import { User } from 'src/app/shared/models/user.model';
import { DealService } from 'src/app/shared/services/deal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Location } from '../../../shared/models/location.model';
import { ViewDealComponent } from '../../modals/view-deal/view-deal.component';
import * as _ from 'lodash';

@UntilDestroy()
@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})
export class DealsComponent implements OnInit {

  paginationDeals: Deal[] = [];
  user: User;
  loadingDeals: boolean = false;
  searchTerm: string = "";
  topDisplay: Deal[];
  bottomDisplay: Deal[];
  // Pagination variables
  batch: number = 3;
  last: any = Date.now();
  empty: boolean = false;

  constructor(private dealService: DealService, private modalController: ModalController, private userService: UserService) { }

  deals$ = this.dealService.deals$;
  
  async ngOnInit() {
    this.loadingDeals = true;

    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        this.user = userProfile;
        console.log("got user", userProfile);

        // this.dealService.getDealsNearLocation(this.user.location).then((result) => {
        //   console.log("resultant deals", result)
        //   this.deals = result;
        //   let results = this.deals;
        //   this.topDisplay = results.slice(0, 5);
        //   this.bottomDisplay = results.slice(5, this.deals.length);
        //   this.loadingDeals = false;
        // })
        this.fetchTodosPaginated();
        this.loadingDeals = false;
      }
    });

  }

  async openDeal(post: Deal){
    const modal = await this.modalController.create({
      component: ViewDealComponent,
      componentProps: {
        post: post
      }
    });
    return await modal.present();
  }

  getLocation(location: Location){
      let result = `${location.subThoroughfare} ${location.thoroughfare}, ${location.subLocality}`;
      return result;
  }

  getSubLocation(location: Location){
      let result = `${location.locality} ${location.administrativeArea}, ${location.postalCode}`;
      return result;
  }

  // Fetch Data via Pagination

  alreadyContainsDeal(deal: Deal){
    for(let pageDeal of this.paginationDeals){
      if(pageDeal.id == deal.id){
        return true;
      }
    }
    return false;
  }

  onScroll () {
    console.log("scroll more")
    setTimeout(() => {
      this.fetchTodosPaginated();
    }, 1500);
  }

  fetchTodosPaginated () {
    console.log("paginate")
    this.dealService.paginate(this.batch, this.last).pipe(
      map(data => {
        console.log("data coming back", data)
        if (!data.length) {
          this.empty = true;
        }
        let last = _.last(data);

        if (last) {
          this.last = last.payload.doc.data().createdAt;
          data.map(todoSnap => {
            let resultData = todoSnap.payload.doc.data();
            let id = todoSnap.payload.doc.id;
            resultData.id = id;
            let result = {...resultData} as Deal;
            if(!this.alreadyContainsDeal(result)){
              this.paginationDeals.push(result);
            }else{
              if(data.length == 1){
                this.empty = true;
              }
            }
          })
        }
      })
    ).subscribe();

  }

}
