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
  errors = {email: "", password: ""};

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  async login(){
    if(this.validateForm()){
      await this.userService.login(this.email, this.password).catch((err) => {
        if(err == "auth/wrong-password"){
          this.errors.password = "Incorrect password";
          return;
        }else if(err == "auth/user-not-found"){
          this.errors.email = "User not found";
          return;
        }else{
          alert("Error: " + err);
        }
      });
    }
  }

  validateForm(){
    return this.validateEmail(this.email);
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
