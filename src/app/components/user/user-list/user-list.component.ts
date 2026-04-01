import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { IRole, IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../user-from/user-form.component';
import { RoleService } from '../../../services/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    UserFormComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnChanges {
  @Input() title: string  = '';
  @Input() users: IUser[] = [];
  @Input() areActionsAvailable: boolean = true;
  @Output() roles : IRole[] = [];
  @Output() callModalAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callDeleteAction: EventEmitter<IUser> = new EventEmitter<IUser>();

  public selectedItem: IUser = {}
  public userService = inject(UserService);
  public roleService = inject(RoleService);
  public modalService = inject(NgbModal);
  userName: String =  "";
  userId: any;

  constructor(public authService: AuthService, public router: Router) {
    let user = localStorage.getItem('auth_user');
      if(user) {
        this.userName = JSON.parse(user)?.role.name;
      } 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
  }

  showDetailModal(item: IUser, modal:any) {
    this.selectedItem = {...item};
    modal.show(); 
  }

  onFormEventCalled (params: IUser) {
    this.userService.update(params);
    this.modalService.dismissAll();
  }
  
}
