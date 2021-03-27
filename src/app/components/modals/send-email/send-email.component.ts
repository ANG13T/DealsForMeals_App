import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent implements OnInit {
  message:string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {}

  sendEmail(){
    if(this.message.length < 20){
      alert("Please type atleast 20 characters");
      return;
    }

    
  }

}
