import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IResetPasswordRequest } from '../../interfaces';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  public requestError!: boolean;
  public validRequest!: boolean;
  public sendForm: { token: string; newPassword: string;} = {
    token: '',
    newPassword: ''
  };

  constructor(private resetPasswordService: ResetPasswordService, public router: Router) {}

  onSubmit(form: NgForm) {
    if (form) {
      if(this.sendForm.token !== "" && this.sendForm.newPassword !== "") {
        const request: IResetPasswordRequest = {
          newPassword: this.sendForm.newPassword
        };
        this.resetPasswordService.resetPassword(this.sendForm.token, request).subscribe({
          next: () => {
          },
          error: (err: any) => {
            console.error('Error in reset password component:', err);
            this.requestError = true;
            this.validRequest = false;
          }
        });
        this.validRequest = true;
        this.requestError = false;
        setTimeout(() => {
          this.router.navigateByUrl('/login')
        }, 1000);
      } else {
        this.requestError = true;
      }
      console.log(this.sendForm)
    }
  }
}
