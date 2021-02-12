import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

}
