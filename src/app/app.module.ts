import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http'; 
import { AngularFirestore } from '@angular/fire/firestore';
import { HomePage } from './components/home/home.page';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SideNavComponent } from './components/navs/side-nav/side-nav.component';
import { BaseNavComponent } from './components/navs/base-nav/base-nav.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { CreatePostComponent } from './components/modals/create-post/create-post.component';
import { EditPostComponent } from './components/modals/edit-post/edit-post.component';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { FoodbanksComponent } from './components/foodbanks/foodbanks.component';
import { LocationsComponent } from './components/locations/locations.component';
import { StoresComponent } from './components/stores/stores.component';

// Material Imports
// TODO: make material module for all material imports
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { ViewBuisnessComponent } from './components/view-buisness/view-buisness.component';
import { ViewDealComponent } from './components/view-deal/view-deal.component';
import { AgmCoreModule } from '@agm/core';
import { IonTextAvatar } from 'ionic-text-avatar';


@NgModule({
  declarations: [AppComponent, HomePage, SignUpComponent, SignInComponent, ProfileComponent, SideNavComponent, BaseNavComponent, EditProfileComponent, CreatePostComponent, EditPostComponent, BottomBarComponent, FoodbanksComponent, LocationsComponent, StoresComponent, ViewBuisnessComponent, ViewDealComponent, IonTextAvatar],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, AngularFireModule.initializeApp(environment.firebaseConfig),AngularFireAuthModule, AngularFireStorageModule, FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, MatStepperModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatIconModule, AgmCoreModule.forRoot({
    apiKey: environment.googleMapsAPIKey
  })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AngularFirestore, NativeGeocoder, Geolocation, MatTabsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
