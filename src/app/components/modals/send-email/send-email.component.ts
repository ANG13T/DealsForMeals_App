import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent implements OnInit {
  sendMail = firebase.functions().httpsCallable('sendMail');
  message:string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {}

  async sendEmail(){
    if(this.message.length < 20){
      alert("Please type atleast 20 characters");
      return;
    }
    if(!this.data.buisness){
      alert("Something went wrong. Please try again");
      return;
    }

    this.sendMail({dest: this.data.buisness.email, message: this.message, username: this.data.sent.name}).then((data) => {
      console.log("got back data", data);
    }).catch((err) => {
      console.log("error", err);
      alert("Something went wrong please try again");
    });
  }

}
