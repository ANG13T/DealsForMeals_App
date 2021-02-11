import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser;
  user$: Observable<any>;
  loggedIn : boolean;
  
  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) { 
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
      console.log("Successful login")
      this.router.navigate(['/profile']);
      return;
    })
    .catch((err) => {
      console.log(err)
      return err;
    })

    return promise;
  }

  async signUp(displayName, accountType, userEmail, userPassword){
      let newUser : User = {
        name: displayName,
        uid: '',
        location: '',
        accountType: accountType,
        email: userEmail,
        photoURL: ''
      }
      return await this.createUserData(newUser, userPassword);
  }

  async signOut(){
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }

  
  private async createUserData(user: User, password: string){
    if(user == null){
      console.log("Something went wrong.")
      return;
    }

    let userExists = await this.afAuth.fetchSignInMethodsForEmail(user.email);

    if(!userExists){
      alert("User already exsists. Please log in.");
      this.router.navigate(['/login']);
    }

    this.afAuth.createUserWithEmailAndPassword(user.email, password).then((userData) => {
        let newUser: User = {
          uid: userData.user.uid,
          email: userData.user.email,
          name: user.name,
          location: '',
          accountType: user.accountType,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/deals2meals-4e239.appspot.com/o/default_user.jpg?alt=media&token=e1c97c88-5aab-487b-ae6d-878415e28b6a'
        }

        this.afs.firestore.collection("users").doc(newUser.uid).set(newUser)
        .then(() => {
          this.loggedIn = true;
        })
        .catch((err) => {
          alert("Error: " + err);
          this.router.navigate(['/']);
        })

    })
    this.router.navigate(['/profile']);
  }

}
