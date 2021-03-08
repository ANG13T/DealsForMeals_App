import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { FoodbanksComponent } from './components/pages/foodbanks/foodbanks.component';
import { HomePage } from './components/pages/home/home.page';
import { LocationsComponent } from './components/pages/locations/locations.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { StoresComponent } from './components/pages/stores/stores.component';
import { ViewBuisnessComponent } from './components/modals/view-buisness/view-buisness.component';
import { ViewDealComponent } from './components/modals/view-deal/view-deal.component';
import { AuthGuard } from './shared/guards/auth.guard';

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
    path: 'foodbanks',
    component: FoodbanksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stores',
    component: StoresComponent,
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
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'buisness/:id',
    component: ViewBuisnessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deal/:id',
    component: ViewDealComponent,
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
