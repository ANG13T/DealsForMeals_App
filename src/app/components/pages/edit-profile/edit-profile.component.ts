import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/internal/operators/finalize';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { NavController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userProfile: User = {name: "", email: "", accountType: "foodbank", photoURL: "", uid: "", location: null, isBusiness: false, description: "", phoneNumber: "", upvotes: [], downvotes: []};
  firstName: string = "";
  lastName: string = "";
  initFirstName: string = "";
  phoneNumber = '';
  initLastName: string = "";
  initUserProfile: User = {name: "", email: "", accountType: "foodbank", photoURL: "", uid: "", location: null, isBusiness: false, phoneNumber: "", upvotes: [], downvotes: []};
  profileLoading: boolean = false;
  errors = {password: "", name: "", email: ""};

  constructor(private router: Router, private userService: UserService, private storage: AngularFireStorage, public toastController: ToastController, private navCtrl: NavController) {
    this.userService.user$.subscribe(async (userProfile) => {
      if(userProfile){
        this.userProfile.name = userProfile.name;
        this.userProfile.email = userProfile.email;
        this.userProfile.photoURL = userProfile.photoURL;
        this.userProfile.accountType = userProfile.accountType;
        this.userProfile.uid = userProfile.uid;
        this.userProfile.location = userProfile.location;
        this.userProfile.description = userProfile.description;
        this.userProfile.isBusiness = userProfile.isBusiness;
        this.userProfile.phoneNumber = userProfile.phoneNumber;

        //init user profile
        this.initUserProfile.name = userProfile.name;
        this.initUserProfile.email = userProfile.email;
        this.initUserProfile.photoURL = userProfile.photoURL;
        this.initUserProfile.accountType = userProfile.accountType;
        this.initUserProfile.uid = userProfile.uid;
        this.initUserProfile.location = userProfile.location;
        this.initUserProfile.description = userProfile.description;
        this.initUserProfile.isBusiness = userProfile.isBusiness;
        this.initUserProfile.phoneNumber = userProfile.phoneNumber;

        if(!userProfile.isBuisness){
          this.initFirstName = this.userProfile.name.split(" ")[0];
          this.initLastName = this.userProfile.name.split(" ")[1];
          this.firstName = this.initFirstName;
          this.lastName = this.initLastName;
        }

      }
    })
  }

  goBack(){
    this.navCtrl.back();
  }

  async editProfile(){
    if(this.validateForm()){
    this.userProfile.isBusiness = (this.userProfile.accountType !='foodie');
    await this.userService.updateUserData(this.userProfile).then(async (data) => {
      if(data){
        alert("Error: " + data.message);
      }else{
        const toast = await this.toastController.create({
          message: 'Profile edited successfully.',
          duration: 2000
        });
        toast.present();
        this.initUserProfile.name = this.userProfile.name;
        this.initUserProfile.email = this.userProfile.email;
        this.initUserProfile.photoURL = this.userProfile.photoURL;
        this.initUserProfile.accountType = this.userProfile.accountType;
        this.initUserProfile.uid = this.userProfile.uid;
        this.initUserProfile.location = this.userProfile.location;
        this.initUserProfile.description = this.userProfile.description;
        this.initUserProfile.isBusiness = this.userProfile.isBusiness;
        this.initUserProfile.phoneNumber = this.userProfile.phoneNumber;
      }
    })
    }
  }

  ngOnInit() {}

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  fieldsDifferent(){
    if(this.userProfile.name != this.initUserProfile.name){
      return true;
    }

    if(this.userProfile.phoneNumber){
      if(this.userProfile.phoneNumber.internationalNumber != this.initUserProfile.phoneNumber.internationalNumber){
        return true;
      }
    }
    
    if(this.userProfile.description != this.initUserProfile.description){
      return true;
    }

    if(this.userProfile.photoURL != this.initUserProfile.photoURL){
      return true;
    }

    if(this.userProfile.accountType != this.initUserProfile.accountType){
      return true;
    }

    return false;
  }

  editUserName(content: string, location: string){
    if(location == "first"){
      this.firstName = content;
    }else{
      this.lastName = content;
    }

    this.userProfile.name = `${this.firstName} ${this.lastName}`;
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

  charsLeft(content: string, amount: number){
    return amount - (content.length);
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

}
