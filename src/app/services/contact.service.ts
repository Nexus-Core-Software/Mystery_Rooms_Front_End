import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';
import { IContact, ISearch } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends BaseService<IContact> {
  protected override source: string = 'contact/sendEmail'; 
  private contactListSignal = signal<IContact[]>([]); 

  get contact$()  {
    return this.contactListSignal;
  }

  public search: ISearch = { 
    page: 1,
    size: 10
  }
  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  sendEmail(contact: IContact) {
    this.add(contact).subscribe({
      next: (response:any) => {
        this.alertService.displayAlert('success', 'Message ' + response.subject + ' sent' , 'center', 'top', ['success-snackbar']);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred sending the email','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    })
  }

}
