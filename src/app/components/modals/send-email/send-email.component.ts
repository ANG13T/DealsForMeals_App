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

  constructor(@Inject(MAT_DIALOG_DATA) public data, private functions: AngularFireFunctions) { }

  ngOnInit() {}

  async sendEmail(){
    const sendMail = this.functions.httpsCallable('sendMail');

    if(this.message.length < 20){
      alert("Please type atleast 20 characters");
      return;
    }
    if(!this.data.buisness){
      alert("Something went wrong. Please try again");
      return;
    }

    const mailObservable = sendMail({dest: this.data.buisness.email, message: this.message, username: this.data.sent.name});

    mailObservable.subscribe(async res => {
      console.log("got back data", res);
    })
  }

}
