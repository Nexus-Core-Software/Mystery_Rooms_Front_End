import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ForgotPasswordService } from '../../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  public loginError!: string;
  loginStatus: boolean = false;
  public requestError!: boolean;
  public validRequest!: boolean;
  @ViewChild('email') emailModel!: NgModel;

  public recovery: { email: string} = {
    email: ''
  };

  constructor(
    private router: Router,
    private forgotPasswordService: ForgotPasswordService
  ) {}

  onSubmit(form: NgForm) {
    if (form) {
      const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if(this.recovery.email !== "" && gmailPattern.test(this.recovery.email)) {
        this.forgotPasswordService.sendForgotPasswordEmail(this.recovery.email).subscribe({
          next: () => {
          },
          error: (err: any) => {
            console.error('Error in forgot password component:', err);
            this.requestError = true;
          }
        });
        this.requestError = false;
        this.validRequest = true;
      } else {
        this.requestError = true;
        this.validRequest = false;
      }
    }
  }

}
