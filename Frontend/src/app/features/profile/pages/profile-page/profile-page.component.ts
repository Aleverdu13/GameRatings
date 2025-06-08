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

  defaultAvatar = 'assets/images/default-avatar.webp';

  // Variables para editar el nombre
  editingName = false;
  newName = '';
  nameError = '';

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

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('avatar', file);

      this.authService.uploadAvatar(formData).subscribe({
        next: (updatedUser: User) => this.user = updatedUser,
        error: (err: any) => console.error('Error subiendo avatar', err)
      });
    }
  }


  startEditingName(): void {
    this.newName = this.user?.name ?? '';
    this.editingName = true;
  }

  cancelEditingName(): void {
    this.editingName = false;
    this.nameError = '';
  }

  submitNameChange(): void {
    if (!this.newName.trim()) {
      this.nameError = 'El nombre no puede estar vacío.';
      return;
    }

    this.authService.changeName(this.newName).subscribe({
      next: (res) => {
        this.user!.name = this.newName;
        this.editingName = false;
        this.nameError = '';
      },
      error: (err) => {
        this.nameError = err.error?.message || 'No se pudo actualizar el nombre.';
      }
    });
  }

}