import { Component, Input } from '@angular/core';
import { Game } from '../../../../interfaces/game.interface';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  @Input() game!: Game;
}
