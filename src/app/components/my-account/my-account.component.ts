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
export class MyAccountComponent implements OnInit {
  public userName: string = '';
  private service = inject(AuthService);
  public authGoogleService = inject(AuthGoogleService)

  constructor(public router: Router) {
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.userName = JSON.parse(user)?.name;
    } 
  }

  ngOnInit() {}

  logout() {
    this.authGoogleService.logout();
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
