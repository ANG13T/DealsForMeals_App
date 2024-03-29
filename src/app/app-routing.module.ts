import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { BuisnessesComponent } from './components/pages/buisnesses/buisnesses.component';
import { HomePage } from './components/pages/home/home.page';
import { LocationsComponent } from './components/pages/locations/locations.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { ViewBuisnessComponent } from './components/modals/view-buisness/view-buisness.component';
import { ViewDealComponent } from './components/modals/view-deal/view-deal.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ShareRateComponent } from './components/pages/share-rate/share-rate.component';
import { HelpComponent } from './components/pages/help/help.component';
import { DealsComponent } from './components/pages/deals/deals.component';
import { ProfileSettingsComponent } from './components/pages/profile-settings/profile-settings.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'login',
    component: SignInComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'buisnesses',
    component: BuisnessesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deals',
    component: DealsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/edit',
    component: EditProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/settings',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/share',
    component: ShareRateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/help',
    component: HelpComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
