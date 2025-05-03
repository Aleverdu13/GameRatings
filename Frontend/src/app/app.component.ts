import { Component } from '@angular/core';
import { AuthModalService } from './shared/services/auth-modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  modalVisible = false;

  constructor(private authModalService: AuthModalService) {
    this.authModalService.isVisible$.subscribe((visible: boolean) => {
      this.modalVisible = visible;
    });
  }
}
