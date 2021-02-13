import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/internal/operators/finalize';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userProfile: User = {name: "", email: "", accountType: "foodbank", photoURL: "", uid: "", location: ""};
  initUserProfile: User = {name: "", email: "", accountType: "foodbank", photoURL: "", uid: "", location: ""};
  profileLoading: boolean = false;
  errors = {password: "", name: "", email: ""};

  constructor(private router: Router, private userService: UserService, private storage: AngularFireStorage, public toastController: ToastController) {
    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        console.log(userProfile)
        this.userProfile.name = userProfile.name;
        this.userProfile.email = userProfile.email;
        this.userProfile.photoURL = userProfile.photoURL;
        this.userProfile.accountType = userProfile.accountType;
        this.userProfile.uid = userProfile.uid;
        this.userProfile.location = userProfile.location;

        //init user profile
        this.initUserProfile.name = userProfile.name;
        this.initUserProfile.email = userProfile.email;
        this.initUserProfile.photoURL = userProfile.photoURL;
        this.initUserProfile.accountType = userProfile.accountType;
      }
    })
  }

  editProfile(){
    if(this.validateForm()){
    this.userService.updateUserData(this.userProfile).then((data) => {
      if(data){
        alert("Error: " + data.message);
      }else{
        this.presentToast();
      }
    })
    }
  }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  fieldsDifferent(){
    return JSON.stringify(this.initUserProfile) != JSON.stringify(this.userProfile);
  }

  validateForm(): boolean{
    let result = true;
    if(this.userProfile.name.length > 30){
      this.errors.name = "Name must be shorter than 30 letters";
      result = false;
    }

    if(this.userProfile.name.length < 5){
      this.errors.name = "Name must be longer than 5 letters";
      result = false;
    }

    if(!this.validateEmail(this.userProfile.email)){
      this.errors.email = "Invalid Email";
      result = false;
    }

    if(this.profileLoading){
      alert("Profile is loading...");
      result = false;
    }

    return result;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onDrop(files: FileList){
    let profileImage = files[0];
    this.uploadTask(profileImage);
  }

  uploadTask(file: File){
    let task: AngularFireUploadTask;
    let downloadURL;

     //Sends data to loading bar
    this.profileLoading = true;
    this.userProfile.photoURL = "../../../assets/images/spinner.gif"
     // The storage path
    const path = `files/${Date.now()}_${file.name}`;
     // Reference to storage bucket
    const ref = this.storage.ref(path);
    console.log(ref);

     // The main task
    task = this.storage.upload(path, file);


    task.snapshotChanges().pipe(
       // The file's download URL
       finalize(async () =>  {
         downloadURL = await ref.getDownloadURL().toPromise();
         this.userProfile.photoURL = downloadURL;
         this.profileLoading = false;
       })
     ).subscribe();
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Profile edited successfully.',
      duration: 2000
    });
    toast.present();
  }

}
