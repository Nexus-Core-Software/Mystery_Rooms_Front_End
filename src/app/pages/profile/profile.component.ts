import { FileUploadService } from './../../services/file-upload.service';
import { ProfileService } from './../../services/profile.service';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileUpdateComponent } from "../../components/profile/profile-update/profile-update.component";
import { IUser } from '../../interfaces';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from "../../components/modal/modal.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileUpdateComponent,
    ModalComponent,
    ReactiveFormsModule
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit {
  updateProfileModale: any;

  updateProfile(user: IUser) {
    this.profileService.update(user);
    this.modalService.closeAll();
  }

  public modalService: ModalService = inject(ModalService);
$event: any;


  @ViewChild('fileInput') fileInput!: ElementRef;
  avatarUrl: string = '../../../../assets/img/profile.png'; // Imagen predeterminada
  selectedFile: File | null = null;
  public profileService = inject(ProfileService);
  activities: any;
  url?: string;

  @ViewChild('updateProfileModal') public updateProfileModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  profileForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    password: [''],
  })

  constructor(private http: HttpClient, private fileUploadService : FileUploadService, private router: Router) {
    this.profileService.getUserInfoSignal();
  }

  ngOnInit(): void {
  }

  goToProfileUpdate(): void {
    this.router.navigate(['/app/profile-update']);
  }

  upload($event: Event) {
    throw new Error('Method not implemented.');
  }

   // Disparar el input oculto
   triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  // Manejar el archivo seleccionado
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      // Actualizar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Subir la imagen al backend
      this.uploadImage();
    }
  }

  // Subir la imagen al backend
  uploadImage(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('profilePicture', this.selectedFile);

    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.url = response.url;
        // Actualizar la URL en el perfil del usuario 
        this.avatarUrl = response.url ?? '../../../../assets/img/profile.png'; // Default to placeholder image
        console.log('Imagen subida con éxito:', this.url);
        },
      error: (err) => console.error('Error al subir la imagen:', err),
    })
  }

  callEdition(user: IUser) {
    this.profileForm.controls['id'].setValue(user.id ? JSON.stringify(user.id) : '');
    this.profileForm.controls['name'].setValue(user.name ? user.name : '');
    this.profileForm.controls['lastname'].setValue(user.lastname ? user.lastname : '');
    this.modalService.displayModal('md', this.updateProfileModal);
  }

  updateUser(user: IUser) {
    this.profileService.update(user);
    this.modalService.closeAll();
  }
}
// 