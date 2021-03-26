import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user.model';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as geofire from 'geofire-common';
import { AngularFireStorage } from '@angular/fire/storage';
import app from 'firebase/app';
import { Deal } from '../models/deal.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser;
  user$: Observable<any>;
  userDeals$: any | undefined;
  location$: Observable<any>;
  loggedIn : boolean;
  location: any;
  
  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore, private geolocation: Geolocation,  private storage: AngularFireStorage, private userService: UserService) {
    this.location$ = this.geolocation.watchPosition();
   
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user){
          this.loggedIn = true;
          this.currentUser = {displayName: user.displayName, email: user.email, imageUrl: user.photoURL, uid: user.uid}
          let userDeals = this.afs.collection('deals', ref => {
            return ref.where('userProfile.uid', '==', this.currentUser.uid).orderBy("createdAt");
          });
          this.userDeals$ = userDeals.snapshotChanges().pipe(map(deals => {
            return deals.map((deal) => {
              let retrievedDoc = deal.payload.doc.data() as Deal;
              retrievedDoc.id = deal.payload.doc.id;
              return retrievedDoc;
            })
          }));
      
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }else{
          this.loggedIn = false;
          this.currentUser = null;
          this.userDeals$ = null;
          return of(null);
        }
      })
    );
   
  }

  async login(email, password): Promise<any>{
    let promise = this.afAuth.signInWithEmailAndPassword(email, password).then((res) => {
      this.loggedIn = true;
      this.router.navigate(['/profile']);
      return;
    })
    .catch((err) => {
      console.log(err)
      return err;
    })

    return promise;
  }

  async googleSignin(){
    const provider = new app.auth.GoogleAuthProvider();
    const creds = await this.afAuth.signInWithPopup(provider);
    const userRef = this.afs.firestore.doc(`users/${creds.user.uid}`);

    userRef.get().then((doc) => {
      if(!doc.exists){
        alert("User not created. Please sign up.");
        this.router.navigate(['/signup']);
        return;
      }else{
        this.loggedIn = true;
        this.router.navigate(['/profile']);
        return;
      }
    })
  }

  async googleSignUp(user: User){
    const provider = new app.auth.GoogleAuthProvider();
    const creds = await this.afAuth.signInWithPopup(provider);
    const userRef = this.afs.firestore.doc(`users/${creds.user.uid}`);

    userRef.get().then((doc) => {
      if(!doc.exists){
        let userData: User = {
          uid: creds.user.uid,
          email: creds.user.email,
          name: creds.user.displayName,
          location: user.location,
          lng: user.location.longitude,
          lat: user.location.latitude,
          hash: geofire.geohashForLocation([user.location.latitude, user.location.longitude]),
          accountType: user.accountType,
          photoURL: creds.user.photoURL,
          isBusiness: user.isBusiness,
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

      }else{
        alert("User already created. Please sign in.");
        this.router.navigate(['/login']);
        return;
      }
    })
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
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/dealsformeals-3f16f.appspot.com/o/default-user.jpeg?alt=media&token=66617a87-47ac-4ff8-92da-9ccc0ad92c0b',
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
      return;
    }).catch((err) => {
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

      if(user.photoURL != "https://firebasestorage.googleapis.com/v0/b/dealsformeals-3f16f.appspot.com/o/default-user.jpeg?alt=media&token=66617a87-47ac-4ff8-92da-9ccc0ad92c0b"){
        this.deleteUserImage(user.photoURL);
      }else{
        this.userService.signOut();
      }

    }).catch((err) => {
      console.log("err", err);
    })
  }

// Pagination Methods
paginate(limit: number, last: string): Observable<DocumentChangeAction<any>[]> {

  return this.afs.collection('users', (ref) => (
    ref
      .where('uid', '<', last)
      .orderBy('uid', 'desc')
      .orderBy('hash')
      .limit(limit)
  )).snapshotChanges();
}
}
