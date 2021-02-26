import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FoodbanksComponent } from './components/foodbanks/foodbanks.component';
import { HomePage } from './components/home/home.page';
import { LocationsComponent } from './components/locations/locations.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { StoresComponent } from './components/stores/stores.component';
import { ViewBuisnessComponent } from './components/view-buisness/view-buisness.component';
import { ViewPostComponent } from './components/view-post/view-post.component';
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
    path: 'post/:id',
    component: ViewPostComponent,
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
