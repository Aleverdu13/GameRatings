import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  user: User | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (data: User) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el perfil.';
        this.loading = false;
      }
    });
  }
}