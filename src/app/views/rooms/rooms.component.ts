import { Component, OnInit } from '@angular/core';
import { RoomService } from '@controllers/room.service';
import { Room } from '@models/room.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  loading = false;
  error: string | null = null;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.error = null;
    
    // Simulamos datos - en producción obtendrías del servicio
    this.rooms = [
      { id: 1, name: 'La Mansión Embrujada', difficulty: 'Media', duration: 60, description: 'Escapa de una casa encantada llena de misterios.' },
      { id: 2, name: 'El Laboratorio Secreto', difficulty: 'Difícil', duration: 90, description: 'Resuelve experimentos científicos para escapar.' },
      { id: 3, name: 'Piratas del Caribe', difficulty: 'Fácil', duration: 45, description: 'Busca el tesoro pirata escondido.' }
    ];

    this.loading = false;
  }

  selectRoom(room: Room): void {
    console.log('Room selected:', room);
    // Aquí irías a la vista de juego de la sala
  }
}
