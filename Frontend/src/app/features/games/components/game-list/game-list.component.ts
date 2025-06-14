import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../../../core/services/game.service';
import { Game } from '../../../../interfaces/game.interface';
import { FilterService } from '../../../../shared/services/filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-list',
  standalone: false,
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  allGames: Game[] = [];
  private filtersSub!: Subscription;
  private activeFilters = {
    category: '',
    year: '',
    scoreMin: 0,
    scoreMax: 100,
    platform: '',
    search: ''
  };

  constructor(
    private gameService: GameService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((data: Game[]) => {
      this.allGames = data;
      this.applyFilters();

      this.filtersSub = this.filterService.filters$.subscribe(filters => {
        this.activeFilters = filters;
        this.applyFilters();
      });
    });
  }

  ngOnDestroy(): void {
    this.filtersSub?.unsubscribe();
  }

  applyFilters(): void {
    this.games = this.allGames.filter(game => {
      const matchCategory = !this.activeFilters.category || game.tags.includes(this.activeFilters.category);
      const matchYear = !this.activeFilters.year || new Date(game.release_date).getFullYear().toString() === this.activeFilters.year;
      const matchScore = game.score >= this.activeFilters.scoreMin && game.score <= this.activeFilters.scoreMax;

      const matchPlatform = !this.activeFilters.platform || game.platforms.includes(this.activeFilters.platform);
      const matchSearch = !this.activeFilters.search || game.name.toLowerCase().includes(this.activeFilters.search.toLowerCase());
      return matchCategory && matchYear && matchScore && matchPlatform && matchSearch;
    });
  }

  currentPage: number = 1;
  itemsPerPage: number = 20;

  get paginatedGames(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.games.slice(start, start + this.itemsPerPage);
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.games.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.games.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
