import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Room } from '@models/room.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/rooms`;
  private rooms$ = new BehaviorSubject<Room[]>([]);

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las salas disponibles
   */
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  /**
   * Obtiene una sala por su ID
   */
  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva sala
   */
  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  /**
   * Actualiza una sala existente
   */
  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  /**
   * Elimina una sala
   */
  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene el observable de salas
   */
  getRooms$(): Observable<Room[]> {
    return this.rooms$.asObservable();
  }
}
