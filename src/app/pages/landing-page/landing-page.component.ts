import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from "../../components/contact/contact-form/contact-form.component";
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  activeTab: number = -1;

  toggleTab(index: number): void {
    this.activeTab = this.activeTab === index ? -1 : index;
  }
  
  images = [
    { src: '../../../../assets/img/gallery/gallery0.png', alt: 'Ejemplo 1' },
    { src: '../../../../assets/img/gallery/gallery1.png', alt: 'Ejemplo 2' },
    { src: '../../../../assets/img/gallery/gallery2.png', alt: 'Ejemplo 3' },
    { src: '../../../../assets/img/gallery/gallery3.png', alt: 'Ejemplo 4' },
    { src: '../../../../assets/img/gallery/gallery4.png', alt: 'Ejemplo 5' },
    { src: '../../../../assets/img/gallery/gallery5.png', alt: 'Ejemplo 6' },
    { src: '../../../../assets/img/gallery/gallery6.png', alt: 'Ejemplo 7' },
    { src: '../../../../assets/img/gallery/gallery7.png', alt: 'Ejemplo 8' },
  ];
  
  activeQuestion: number | null = null;

  toggleAnswer(questionNumber: number) {
    this.activeQuestion = this.activeQuestion === questionNumber ? null : questionNumber;
  }
  
  mysterysRooms() {
    window.location.href = '/dashboard';
  }
}
