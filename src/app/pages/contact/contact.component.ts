import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ContactFormComponent } from '../../components/contact/contact-form/contact-form.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ContactService } from '../../services/contact.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IContact } from '../../interfaces';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ContactFormComponent,
    PaginationComponent, //MISSING PAGINATION ON BACKEND
    ModalComponent,
    LoaderComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  public contactService: ContactService = inject(ContactService);

  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public routeAuthorities: string[] = [];
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);



  public fb: FormBuilder = inject(FormBuilder);
  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  })

  constructor() {
  }

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  sendEmail(contact: IContact) {
    console.log('sendEmail() test:', contact)
    this.contactService.sendEmail(contact);
    this.modalService.closeAll();
  }


  callEdition(contact: IContact) {
    this.contactForm.controls['name'].setValue(contact.name ? contact.name : '');
    this.contactForm.controls['email'].setValue(contact.email ? contact.email : '');
    this.contactForm.controls['subject'].setValue(contact.subject ? contact.subject : '');
    this.contactForm.controls['message'].setValue(contact.message ? contact.message : '');
    //this.modalService.displayModal('md', this.sendEmailModal);
  }


}
