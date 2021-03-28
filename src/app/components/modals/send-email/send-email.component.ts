import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent implements OnInit {
  message:string = "";
  loading: boolean = false;
  complete: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private functions: AngularFireFunctions) { }

  ngOnInit() {}

  async sendEmail(){
    const sendMail = this.functions.httpsCallable('emailMessage');

    if(this.message.length < 20){
      alert("Please type atleast 20 characters");
      return;
    }
    if(!this.data.buisness){
      alert("Something went wrong. Please try again");
      return;
    }

    this.loading = true;
    sendMail({dest: this.data.buisness.email, message: this.message, username: this.data.sent.name}).toPromise().then((result) => {
      console.log("resultant", result);
      this.loading = false;
      this.complete = true;
    }).catch((err) => {
      console.log("there was an error", err);
      alert("Something went wrong. Please try again");
      this.loading = false;
    })
    

  }

}
