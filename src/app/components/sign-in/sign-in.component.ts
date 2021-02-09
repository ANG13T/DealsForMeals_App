import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  name: string = "";
  email: string = "";
  password: string = "";

  constructor(private router: Router) { }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  signIn(){
    
  }

}
