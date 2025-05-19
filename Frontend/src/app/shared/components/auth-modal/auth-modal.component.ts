import { Component } from '@angular/core';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: false,
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  isLogin: boolean = true;

  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', password: '', password_confirmation: '' };
  errorMessage: string = '';


  constructor(
    public modalService: AuthModalService,
    private authService: AuthService
  ) {}

  private getErrorMessage(error: any): string {
    if (error.error?.error && typeof error.error.error === 'string') {
      return error.error.error;
    }
  
    if (error.error && typeof error.error === 'object') {
      const messagesArray = Object.values(error.error)
        .flat()
        .filter((msg): msg is string => typeof msg === 'string'); // Filtrar solo strings
  
      if (messagesArray.length > 0) {
        return messagesArray[0];
      }
    }
  
    return 'Error desconocido';
  }
  

  toggleLoginRegister(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }
  
    
  onLogin(): void {
    this.errorMessage = ''; // Limpiar error anterior
  
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.authService.setUser(response.user);
        this.authService.saveToken(response.token);
        console.log('Login exitoso', response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }
  
  onRegister(): void {
    this.errorMessage = ''; // Limpiar error anterior
  
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        console.log('Registro exitoso', response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al registrarse', error);
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }
  
  

  closeModal() {
    this.modalService.hide();
  }

  onBackgroundClick(event: MouseEvent): void {
    this.closeModal();
  }
  
}