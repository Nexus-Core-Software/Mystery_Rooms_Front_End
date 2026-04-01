import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs/internal/Subject';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  public tokenReceived$ = new Subject<string>();
  public oauthService = inject(OAuthService);
  public router = inject(Router);
  public isProcessingGoogleAutentication: any = localStorage.getItem('isProcessingGoogleAutentication') ? localStorage.getItem('isProcessingGoogleAutentication') : 'false';
  public authService = inject(AuthService);

  // constructor() { 
  //   this.configureOAuth();
  // }

  private configureOAuth() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '586708376606-g1577kothlf55g5e8ijle3tcl2vvjnnu.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/app/dashboard',
      scope: 'openid profile email',
    };
    this.oauthService.configure(config);

    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      localStorage.setItem('isProcessingGoogleAutentication', 'false');
      if (this.oauthService.hasValidIdToken()) {
        console.log('profile', this.oauthService.getIdentityClaims());
        // este es el token id que google automáticamente regisgtra en el sessión storage
        console.log('id_token', sessionStorage.getItem('id_token'));
        // aquí tienes que agregar el llamado al método del back-end que valida el idToken de google y genera el token para guardarlo en el authService dentro del local storage
        this.authService.loginWithGoogle(sessionStorage.getItem('id_token'))
      } else {
        this.router.navigateByUrl('/login');
      }

    });

    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        const idToken = this.getIdToken();
        if (idToken) {
          this.tokenReceived$.next(idToken);
        }
      }
    });
  }

  login() {
    localStorage.setItem('isProcessingGoogleAutentication', 'true');
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.revokeTokenAndLogout();
    this.oauthService.logOut();
  }

  getProfileClaims() {
    return this.oauthService.getIdentityClaims();
  }

  getAccessToken(): string | null {
    return this.oauthService.getAccessToken();
  }

   getIdToken(): string | null {
    return this.oauthService.getIdToken();
  }
}
