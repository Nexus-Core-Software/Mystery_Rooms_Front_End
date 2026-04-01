import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { ResetPasswordService } from '../../../services/reset-password.service';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {

  avatarUrl: string = '../../../../assets/img/profile.png'; // Imagen predeterminada
  selectedFile: File | null = null;
  url?: string;

  public user: IUser = { password: '', confirmPassword: '' };
  public profileService = inject(ProfileService);
  public formBuilder: FormBuilder = inject(FormBuilder);

  public sendForm: { user: string; newPassword: string; } = {
    user: '',
    newPassword: ''
  };

  @Input() profileForm: FormGroup = this.formBuilder.group({});
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  

  constructor(private resetPasswordService: ResetPasswordService, private router: Router, private authService: AuthService) {
    this.profileService.getUserInfoSignal();
  }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      id: [''],
      name: [''],
      lastname: [''],
      email: [''],
      phoneNumber: [''],
      address: [''],
      password: [''],
      confirmPassword: [''],
      enabled: [true]
    });
  }

  goToProfile(): void {
    this.router.navigate(['/app/profile']);
  }

  upload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.authService.uploadFile(formData).subscribe(response => {
        console.log('response', response);
        console.log(this.url)
      });
    }
  }

  callSave() {
    let user: IUser = {
      name: this.profileForm.controls['name'].value,
      lastname: this.profileForm.controls['lastname'].value,
      phoneNumber: this.profileForm.controls['password'].value,
      address: this.profileForm.controls['password'].value,
    }
    if(this.profileForm.controls['id'].value) {
      user.id = this.profileForm.controls['id'].value;
    } 
    if(user.id) {
      this.callUpdateMethod.emit(user);
    }
  }
}
// 