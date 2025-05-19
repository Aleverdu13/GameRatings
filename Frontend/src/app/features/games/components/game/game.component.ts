import { Component, Input } from '@angular/core';
import { Game } from '../../../../interfaces/game.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  @Input() game!: Game;

  constructor(private router: Router) {}

  goToDetail(): void {
    this.router.navigate(['/games', this.game.id]);
  }
}
