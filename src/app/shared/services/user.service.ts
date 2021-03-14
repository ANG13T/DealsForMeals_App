import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as geofire from 'geofire-common';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser;
  user$: Observable<any>;
  loggedIn : boolean;
  location: any;
  
  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore, private geolocation: Geolocation,  private storage: AngularFireStorage, private userService: UserService) {
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data: any) => {
    // this.location.latitude = data.coords.latitude;
    // this.location.longitude = data.coords.longitude;
    // }); 
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user){
          this.loggedIn = true;
          this.currentUser = {displayName: user.displayName, email: user.email, imageUrl: user.photoURL, uid: user.uid}
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }else{
          this.loggedIn = false;
          this.currentUser = null;
          return of(null);
        }
      })
    )
  }

  async login(email, password): Promise<any>{
    let promise = this.afAuth.signInWithEmailAndPassword(email, password).then((res) => {
      this.loggedIn = true;
      this.router.navigate(['/profile']);
      console.log("Success");
      return;
    })
    .catch((err) => {
      console.log(err)
      return err;
    })

    return promise;
  }

  async checkUserExsists(newUser: User): Promise<any>{
    let userExists = await this.afAuth.fetchSignInMethodsForEmail(newUser.email);
    return userExists;
  }


  async signUp(newUser: User, userPassword: string): Promise<any>{
      let promise = this.afAuth.createUserWithEmailAndPassword(newUser.email, userPassword).then((uData) => {
          let userData: User = {
            uid: uData.user.uid,
            email: uData.user.email,
            name: newUser.name,
            location: newUser.location,
            lng: newUser.location.longitude,
            lat: newUser.location.latitude,
            hash: geofire.geohashForLocation([newUser.location.latitude, newUser.location.longitude]),
            accountType: newUser.accountType,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/deals2meals-4e239.appspot.com/o/default_user.jpg?alt=media&token=e1c97c88-5aab-487b-ae6d-878415e28b6a',
            isBusiness: newUser.isBusiness,
            description: ''
          }
  
          this.afs.firestore.collection("users").doc(userData.uid).set(userData)
          .then(() => {
            this.loggedIn = true;
            this.router.navigate(['/profile']);
            return;
          })
          .catch((err) => {
            alert("Error: " + err);
            return err;
          })
      }).catch((err) => {
        return err;
      })
      return promise; 
  }

  async signOut(){
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }

  async updateUserData(user: User): Promise<any>{
    let promise = this.afs.firestore.collection("users").doc(user.uid).update(user).then(() => {
      console.log("user updated")
      return;
    }).catch((err) => {
      console.log("err");
      return err;
    })

    return promise;
  }

  async deleteUserImage(imageURL: string){
    let storageRefFile = this.storage.refFromURL(imageURL);
    await storageRefFile.delete().toPromise().then(() => {
      this.userService.signOut();
    }).catch((error) => {
      console.log("error with storage file delete", error.message);
    });
  }

  async deleteUser(user: User){
   this.afs.firestore.collection("users").doc(user.uid).delete().then(async() => {
      console.log("user deleted")

      if(user.photoURL != "https://firebasestorage.googleapis.com/v0/b/deals2meals-4e239.appspot.com/o/default_user.jpg?alt=media&token=e1c97c88-5aab-487b-ae6d-878415e28b6a"){
        this.deleteUserImage(user.photoURL);
      }else{
        this.userService.signOut();
      }

    }).catch((err) => {
      console.log("err", err);
    })
  }

}
