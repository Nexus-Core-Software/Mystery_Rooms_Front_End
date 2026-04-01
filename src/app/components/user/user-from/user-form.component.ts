import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IUser, IRole } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule, 
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  public fb: FormBuilder = inject(FormBuilder);

  roleService = inject(RoleService);

  @Input() userForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();

  ngOnInit() {
  }

  callSave() {
    let user: IUser = {
      email: this.userForm.controls['email'].value,
      name: this.userForm.controls['name'].value,
      lastname: this.userForm.controls['lastname'].value,
      password: this.userForm.controls['password'].value,
      enabled: this.userForm.controls['enabled'].value
    }
    if(this.userForm.controls['id'].value) {
      user.id = this.userForm.controls['id'].value;
    } 
    if(user.id) {
      this.callUpdateMethod.emit(user);
    } else {
      this.callSaveMethod.emit(user);
    }
  }
}
