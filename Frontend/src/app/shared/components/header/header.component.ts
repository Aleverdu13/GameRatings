import { Component, EventEmitter, Output } from '@angular/core';
import { Filter } from '../../../interfaces/filter.interface';

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
  
}
