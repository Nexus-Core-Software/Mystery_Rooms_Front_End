import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'api-iframe',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
  standalone: true,
})
export class ApiComponent implements OnInit {
  iframeSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  private baseUrl = 'https://pixlr.com/editor/?token=';

  public jwtService = inject(AuthService);

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const imageid = localStorage.getItem('image_ID');
    if (imageid !== null) {
      const numericImageId = parseInt(imageid, 10);
      
      this.jwtService.getImageToken(numericImageId).then(jwt => {
        const tokenUrl = this.baseUrl + jwt;
        console.log('Token URL:', tokenUrl);
        this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tokenUrl);
        console.log('Safe URL:', this.iframeSrc);
      }).catch(error => {
        console.error('Error getting JWT', error);
      });
    } else { 
      console.error('El ID de la imagen es nulo'); 
    }
  }
}
