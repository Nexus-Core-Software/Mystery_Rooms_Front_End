import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { UserFormComponent } from '../../components/user/user-from/user-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from '../../services/role.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    UserFormComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  public userService: UserService = inject(UserService);
  public roleService = inject(RoleService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public routeAuthorities: string[] = [];
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);


  @ViewChild('addUsersModal') public addUsersModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  userForm = this.fb.group({
    id: [''],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    password: [''],
    //role: ['', Validators.required],
    enabled: ['', Validators.required]
  })

  constructor() {
    this.userService.search.page = 1;
    this.userService.getAll();
    this.roleService.search.page = 1;
    this.roleService.getAll();
  }

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.userService.getAll();
    //this.roleService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  saveUser(user: IUser) {
    console.log('user', user)
    this.userService.save(user);
    this.modalService.closeAll();
    window.location.reload();
  }

  callEdition(user: IUser) {
    this.userForm.controls['id'].setValue(user.id ? JSON.stringify(user.id) : '');
    this.userForm.controls['email'].setValue(user.email ? user.email : '');
    this.userForm.controls['email'].disable();
    this.userForm.controls['name'].setValue(user.name ? user.name : '');
    this.userForm.controls['lastname'].setValue(user.lastname ? user.lastname : '');
    // this.userForm.controls['password'].setValue(user.password ? user.password : '');
    //this.userForm.controls['role'].setValue(user.role ? JSON.stringify(user.role) : '');
    this.userForm.controls['enabled'].setValue(user.enabled ? JSON.stringify(user.enabled) : '');
    this.modalService.displayModal('md', this.addUsersModal);
  }
  

  updateUser(user: IUser) {
    this.userService.update(user);
    this.modalService.closeAll();
  }

  confirmDelete(user: IUser): void {
      Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar el usuario: ${user.name} ${user.lastname}?`,
        icon: 'warning',
        background: '#1e1e1e', // dark background color 
        color: '#ffffff',
        iconColor: '#8F34E6',
        showCancelButton: true,
        confirmButtonColor: '#8F34E6',
        cancelButtonColor: '#7B69F1',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.delete(user);
          Swal.fire({
            title: "Eliminado!",
            text: "El usuario ha sido eliminado.",
            icon: "success",
            background: '#1e1e1e', // dark background color 
            color: '#ffffff',
            iconColor: '#8F34E6',
          });
        }
      });
    }

  clearForm() {
    this.userForm.reset();
    this.userForm.controls['email'].enable();
  }
}
