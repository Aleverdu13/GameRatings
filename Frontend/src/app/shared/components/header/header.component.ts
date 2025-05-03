import { Component, EventEmitter, Output } from '@angular/core';
import { Filter } from '../../../interfaces/filter.interface';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() filtersChanged: EventEmitter<Filter> = new EventEmitter<Filter>();

  category: string = '';
  year: string = '';
  score: string = '';
  platform: string = '';
  search: string = '';
  isLoggedIn: boolean = false;

  onFilterChange() {
    this.filtersChanged.emit({
      category: this.category,
      year: this.year,
      score: this.score,
      platform: this.platform,
      search: this.search
    });
  }
  
  clearFilters() {
    this.category = '';
    this.year = '';
    this.score = '';
    this.platform = '';
    this.search = '';
  
    this.onFilterChange(); // Se emiten los valores reseteados
  }
  
  constructor(
    private authModalService: AuthModalService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.loggedIn$.subscribe((logged: boolean) => {
      this.isLoggedIn = logged;
    });
  }

  openAuthModal(): void {
    this.authModalService.show();
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  /* Controla si el menú desplegable se ve o no */
  menuOpen: boolean = false; // controla si el menú está abierto

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
  }

  // Cierra el menú al hacer clic en el fondo
  onBackgroundClick(event: MouseEvent): void {
    this.menuOpen = false;
  }  

}
