import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from "../../components/contact/contact-form/contact-form.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
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
