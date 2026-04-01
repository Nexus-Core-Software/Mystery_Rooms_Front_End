import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reto4Request, Reto4Response } from '../../shared/models/reto4.model';

@Injectable({
  providedIn: 'root'
})
export class Reto4Service {

  private apiUrl = 'http://localhost:8080/api/game/reto4';

  constructor(private http: HttpClient) {}

  // Guarda el resultado del Reto 4 en el backend
  guardarResultado(userId: number, resultado: Reto4Request): Observable<Reto4Response> {
    return this.http
      .post<Reto4Response>(`${this.apiUrl}/resultado/${userId}`, resultado)
      .pipe(
        catchError(error => {
          console.error('[Reto4Service] Error al guardar resultado:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtiene el historial de resultados del usuario
  obtenerResultados(userId: number): Observable<Reto4Response[]> {
    return this.http
      .get<Reto4Response[]>(`${this.apiUrl}/resultados/${userId}`)
      .pipe(
        catchError(error => {
          console.error('[Reto4Service] Error al obtener resultados:', error);
          return throwError(() => error);
        })
      );
  }

  // Verifica que el backend esté disponible
  healthCheck(): Observable<string> {
    return this.http.get(`${this.apiUrl}/health`, { responseType: 'text' });
  }
}
