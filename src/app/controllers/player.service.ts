import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '@models/room.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = `${environment.apiUrl}/players`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los jugadores
   */
  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  /**
   * Obtiene un jugador por su ID
   */
  getPlayerById(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo jugador
   */
  createPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player);
  }

  /**
   * Obtiene el ranking de jugadores
   */
  getLeaderboard(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/leaderboard`);
  }
}
