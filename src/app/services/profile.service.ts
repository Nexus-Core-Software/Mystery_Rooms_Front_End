import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  update(user: IUser) {
    throw new Error('Method not implemented.');
  }
  updateUserProfile(updatedData: { name: string | undefined; lastname: string | undefined; phoneNumber: string | undefined; address: string | undefined; bio: any; avatarUrl: string; }) {
  }
  protected override source: string = 'users/me';
  private userSignal = signal<IUser>({});
  private snackBar = inject(MatSnackBar);

  get user$() {
    return  this.userSignal;
  }

  getUserInfoSignal() { 
    this.findAll().subscribe({ 
      next: (response: any) => { 
        this.userSignal.set(response); 
    }, 
    error: (error: any) => { 
      this.snackBar.open( 
        `Error getting user profile info ${error.message}`, 
        'Close', 
          { 
            horizontalPosition: 'right', 
            verticalPosition: 'top', 
            panelClass: ['error-snackbar'] 
          } 
        ) 
      } 
    }); 
  }
}
// 