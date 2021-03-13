import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})


export class HelpComponent implements OnInit {


  constructor(private navCtrl: NavController) {

  }

  ngOnInit() { }

  goBack() {
    this.navCtrl.back();
  }

}
