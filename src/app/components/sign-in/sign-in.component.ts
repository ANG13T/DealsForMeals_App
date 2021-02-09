import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  async login(){
    await this.userService.login(this.email, this.password);
  }

}
