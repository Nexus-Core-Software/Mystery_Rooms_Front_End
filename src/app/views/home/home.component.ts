import { Component, OnInit } from '@angular/core';
import { RoomService } from '@controllers/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  welcomeMessage = 'Bienvenido a Mystery Rooms';
  description = 'Resuelve misterios y escapa de salas enigmáticas';
  
  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    console.log('Home component initialized');
  }
}
