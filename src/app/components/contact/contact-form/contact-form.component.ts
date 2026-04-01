import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IContact } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent implements OnInit {

  @Input() title: string = '';
  @Input() contactForm!: FormGroup;
  @Output() callSendMethod: EventEmitter<IContact> = new EventEmitter<IContact>();

  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    
    this.contactForm = this.fb.group({
      name: [user?.name || ''],
      lastName: [user?.lastname || ''],
      email: [user?.email || ''],
      subject: [''],
      message: ['']
    });
  }

  sendEmail() {
    console.log('Save button clicked');
    let contact: IContact = {
      name: this.contactForm.controls['name'].value,
      email: this.contactForm.controls['email'].value,
      subject: this.contactForm.controls['subject'].value,
      message: this.contactForm.controls['message'].value
    }
    this.callSendMethod.emit(contact);
  }
}
