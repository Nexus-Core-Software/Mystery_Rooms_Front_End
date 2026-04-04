import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AuthGoogleService } from "../../services/auth-google.service";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
})
export class MyAccountComponent {
  public userName: string = '';
  public dropdownOpen = false;

  constructor(private router: Router,
              private service: AuthService,
              private authGoogleService: AuthGoogleService) {
    const user = localStorage.getItem('auth_user');
    if (user) {
      this.userName = JSON.parse(user)?.name;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authGoogleService.logout();
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
