import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ContactComponent } from './pages/contact/contact.component';
// import { CameraComponent } from './components/camera/camera.component';
import { ProfileUpdateComponent } from './components/profile/profile-update/profile-update.component';
// import { GaleryComponent } from './pages/galery/galery.component';
import { ApiComponent } from './components/api/api.component';
import { TokenExpiredComponent } from './pages/token-expired/token-expired.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: 'token-expired',
    component: TokenExpiredComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRoleType.superAdmin
          ],
          name: 'Usarios',
          showInSidebar: true
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { 
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Dashboard',
          showInSidebar: false
        }
      },
      {
        path: 'landing',
        component: LandingPageComponent,
        data: { 
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Landing',
          showInSidebar: false
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { 
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'profile',
          showInSidebar: false
        }
      },
      {
        path: 'profile-update',
        component: ProfileUpdateComponent,
        data: { 
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'profile-update',
          showInSidebar: false
        }
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { 
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Contactenos',
          showInSidebar: true
        }
      }
    ],
  },
];
