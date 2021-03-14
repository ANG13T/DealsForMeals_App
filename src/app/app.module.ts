
import { RouteReuseStrategy } from '@angular/router';
import { environment } from 'src/environments/environment';

//  Geolocation
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

// Modules
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MaterialModule } from './shared/modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AgmCoreModule } from '@agm/core';
import { AvatarModule } from 'ngx-avatar';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { IonBottomSheetModule } from 'ion-bottom-sheet';

// Components
import { AppComponent } from './app.component';
import { HomePage } from './components/pages/home/home.page';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SideNavComponent } from './components/accessories/side-nav/side-nav.component';
import { BaseNavComponent } from './components/accessories/base-nav/base-nav.component';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { CreatePostComponent } from './components/modals/create-post/create-post.component';
import { EditPostComponent } from './components/modals/edit-post/edit-post.component';
import { BottomBarComponent } from './components/accessories/bottom-bar/bottom-bar.component';
import { FoodbanksComponent } from './components/pages/foodbanks/foodbanks.component';
import { LocationsComponent } from './components/pages/locations/locations.component';
import { ViewBuisnessComponent } from './components/modals/view-buisness/view-buisness.component';
import { ViewDealComponent } from './components/modals/view-deal/view-deal.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { ChipsSelectComponent } from './components/accessories/chips-select/chips-select.component';
import { ViewAllDealsComponent } from './components/modals/view-all-deals/view-all-deals.component';
import { AgmOverlays } from "agm-overlays"
import { HelpComponent } from './components/pages/help/help.component';
import { ShareRateComponent } from './components/pages/share-rate/share-rate.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { DealsComponent } from './components/pages/deals/deals.component';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@NgModule({
  declarations: [AppComponent, HomePage, SignUpComponent, SignInComponent, ProfileComponent, SideNavComponent, BaseNavComponent, EditProfileComponent, CreatePostComponent, EditPostComponent, BottomBarComponent, FoodbanksComponent, LocationsComponent, ViewBuisnessComponent, ViewDealComponent, SettingsComponent, CreatePostComponent, ChipsSelectComponent, ViewAllDealsComponent,  HelpComponent, ShareRateComponent, DealsComponent],
  entryComponents: [CreatePostComponent, EditPostComponent, ViewAllDealsComponent, ViewDealComponent, ViewBuisnessComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireAuthModule, AngularFireStorageModule, FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, MaterialModule, AgmOverlays, AgmCoreModule.forRoot({
    apiKey: environment.googleMapsAPIKey
  }), AvatarModule, IonBottomSheetModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AngularFirestore, NativeGeocoder, Geolocation,SocialSharing, AppRate, EmailComposer],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
