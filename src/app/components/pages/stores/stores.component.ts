import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
})
export class StoresComponent implements OnInit {

  stores: User[] = [];
  constructor(private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.getStores(5).then((data) => {
      this.stores = data;
    })
  }

}
