import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Game } from '../../interfaces/game.interface';
import { Review } from '../../interfaces/review.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:8000/api/games';

  constructor(private http: HttpClient) {}

  // Trae todos los juegos de la API
  // y transforma los campos de la respuesta para que sean arrays para evitar errores
  getGames(): Observable<Game[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(games =>
        games.map(game => ({
          ...game,
          tags: this.ensureArray(game.tags),
          platforms: this.ensureArray(game.platforms),
          lang: this.ensureArray(game.lang),
          screenshot: this.ensureArray(game.screenshot),
          videos: this.ensureArray(game.videos),
          sys_req: typeof game.sys_req === 'string' ? JSON.parse(game.sys_req) : game.sys_req
        }))
      )
    );
  }

  // Traa un único juego por ID de la API
  getGameById(id: number): Observable<Game> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(game => ({
        ...game,
        tags: this.ensureArray(game.tags),
        platforms: this.ensureArray(game.platforms),
        lang: this.ensureArray(game.lang),
        screenshot: this.ensureArray(game.screenshot),
        videos: this.ensureArray(game.videos),
        sys_req: typeof game.sys_req === 'string' ? JSON.parse(game.sys_req) : game.sys_req
      }))
    );
  }

  // Función para asegurarse de que el campo es un array
  // Si no es un array, intenta parsear el campo como JSON
  private ensureArray(field: any): string[] {
    if (Array.isArray(field)) return field;
    try {
      return typeof field === 'string' ? JSON.parse(field) : [];
    } catch {
      return [];
    }
  }

  // Función para añadir reviews a un juego
  addReview(gameId: number, review: { score: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${gameId}/reviews`, review);
  }
  
}
