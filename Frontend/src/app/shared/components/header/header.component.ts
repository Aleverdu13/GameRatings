import { Component, EventEmitter, Output } from '@angular/core';
import { Filter } from '../../../interfaces/filter.interface';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  //@Output() filtersChanged: EventEmitter<Filter> = new EventEmitter<Filter>();

  category: string = '';
  year: string = '';
  scoreMin: number = 0;
  scoreMax: number = 100;
  platform: string = '';
  search: string = '';
  isLoggedIn: boolean = false;

  years: string[] = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000"];
  
  categories: string[] = ["Multiplayer", "Action", "Singleplayer", "Open World", "Adventure", "RPG", "Simulation", "First-Person", "Co-op", "Strategy", "Shooter", "Exploration", "Online Co-Op", "Survival", "Sandbox", "FPS", "Story Rich", "PvP", "Building", "Free to Play", "Third Person", "Base Building", "Realistic", "Crafting", "Character Customization", "Horror", "3D", "Fantasy", "Action RPG", "Action-Adventure", "Sci-fi", "Atmospheric", "Management", "Early Access", "Indie", "Casual", "Massively Multiplayer", "War", "Open World Survival Craft", "Third-Person Shooter", "Roguelite", "Space", "Military", "Roguelike", "Anime", "Tactical", "PvE", "Souls-like", "MMORPG", "Great Soundtrack", "City Builder", "Moddable", "2D", "Difficult", "Relaxing", "Resource Management", "Hack and Slash", "Funny", "Pixel Graphics", "VR", "Medieval","Automobile Sim", "Post-apocalyptic", "Survival Horror", "Dark Fantasy", "Economy", "Driving", "Historical", "Team-Based", "Zombies", "Action Roguelike", "Sports", "Immersive Sim", "Combat", "Gore", "Turn-Based Strategy", "Loot", "RTS", "Psychological Horror", "Dungeon Crawler", "Turn-Based Combat", "Life Sim", "Physics", "Choices Matter", "JRPG", "Looter Shooter", "Grand Strategy", "Colony Sim", "Stealth", "Racing", "Dark", "Violent", "Sexual Content", "Arcade", "Competitive", "Crime", "Platformer", "Card Game", "eSports", "Magic", "World War II", "Isometric", "Local Co-Op", "Controller", "Fighting", "Cute", "4X", "Turn-Based Tactics", "Local Multiplayer", "Female Protagonist", "Puzzle", "Nudity", "Mature", "Multiple Endings", "Hentai", "Family Friendly", "Battle Royale", "Deckbuilding", "Cinematic", "Party-Based RPG", "Flight"];

  platforms: string[] = ["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Meta Quest", "HTC Vive", "PlayStation VR", "PS5", "Switch", "PlayStation Vita", "Google Stadia"];

  isGamesPage: boolean = false;

  currentLang: 'en' | 'es';

  constructor(
    private authModalService: AuthModalService,
    private authService: AuthService,
    private router: Router,
    private filterService: FilterService,
    private langService: LangService
  ) {
    this.authService.loggedIn$.subscribe((logged: boolean) => {
      this.isLoggedIn = logged;
    });

    this.router.events.subscribe(() => {
      this.isGamesPage = this.router.url === '/games';
    });

    this.currentLang = this.langService.getLang();
  }

  onFilterChange(): void {
    if (this.scoreMin > this.scoreMax) {
      [this.scoreMin, this.scoreMax] = [this.scoreMax, this.scoreMin]; // intercambia valores
    }

    this.filterService.setFilters({
      category: this.category,
      year: this.year,
      scoreMin: this.scoreMin,
      scoreMax: this.scoreMax,
      platform: this.platform,
      search: this.search
    });
  }

  
  clearFilters() {
    this.category = '';
    this.year = '';
    this.scoreMin = 0;
    this.scoreMax = 100;
    this.platform = '';
    this.search = '';
  
    this.onFilterChange(); // Se emiten los valores reseteados
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


  showFilters: boolean = false;
  // Controla si los filtros se ven o no
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  goToGames(): void {
    this.router.navigate(['/games']);
  }

  goToPolls(): void {
    this.router.navigate(['/polls']);
  }

  changeLang(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value === 'en' || value === 'es') {
      this.currentLang = value;
      this.langService.setLang(value);
    }
  }
}
