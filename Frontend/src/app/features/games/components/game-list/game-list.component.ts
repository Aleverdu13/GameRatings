import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GameService } from '../../../../core/services/game.service';

@Component({
  selector: 'app-game-list',
  standalone: false,
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})

export class GameListComponent implements OnInit {
  @Input() filters: {
    category: string,
    year: string,
    score: string,
    platform: string,
    search: string
  } = {
    category: '',
    year: '',
    score: '',
    platform: '',
    search: ''
  };

  games: any[] = [];
  allGames: any[] = [];

  constructor(private gameService: GameService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.applyFilters();
    }
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(data => {
      this.allGames = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.games = this.allGames.filter(game => {
      const matchCategory = !this.filters.category || game.tags.includes(this.filters.category);
      const matchYear = !this.filters.year || new Date(game.release_date).getFullYear().toString() === this.filters.year;
      const matchScore = !this.filters.score || game.score >= parseFloat(this.filters.score);
      const matchPlatform = !this.filters.platform || game.platforms.includes(this.filters.platform);
      const matchSearch = !this.filters.search || game.name.toLowerCase().includes(this.filters.search.toLowerCase());
      return matchCategory && matchYear && matchScore && matchPlatform && matchSearch;
    });
  }
  

}
