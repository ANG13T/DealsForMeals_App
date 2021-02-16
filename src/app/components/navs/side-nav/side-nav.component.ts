import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { menuController } from "@ionic/core";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
    menuController.toggle();
  }

}
