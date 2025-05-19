import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user.interface';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl: string = 'http://localhost:8000/api';

  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getToken() !== null);
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  register(data: RegisterData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.loggedInSubject.next(true); // Se emite que se ha logueado
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.loggedInSubject.next(false); // Se emite que se ha deslogueado
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (e) {
      console.error('Token inválido', e);
      return null;
    }
  }

  private currentUser: User | null = null;

  setUser(user: User): void {
    console.log('Usuario guardado:', user);
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

