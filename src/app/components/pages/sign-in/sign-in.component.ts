import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignInComponent implements OnInit {

  email: string = "";
  password: string = "";
  loading: boolean = false;
  errors = {email: "", password: ""};

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.loading = false;
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  async login(){
    if(this.validateForm()){
      this.loading = true;
        await this.userService.login(this.email, this.password).then((data) => {
          if(data){
            this.loading = false;
            if(data.code == "auth/user-not-found"){
              alert("User not found. Please try signing in or trying again");
              this.email = "";
              this.password = "";
            }else if(data.code == "auth/wrong-password"){
              this.password = "";
              this.errors.password = "Invalid password";
            }else{
              alert(data.message);
            }
          }
        })
    }
  }

  validateForm(){
    if(!this.validateEmail(this.email)){
      this.errors.email = "Invalid email";
      return false;
    }

    return true;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async googleLogIn(){
    await this.userService.googleSignin();
  }
  

}
