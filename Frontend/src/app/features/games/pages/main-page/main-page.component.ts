import { Component } from '@angular/core';
import { Filter } from '../../../../interfaces/filter.interface';


@Component({
  selector: 'app-main-page',
  standalone: false,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  activeFilters = {
    category: '',
    year: '',
    score: '',
    platform: '',
    search: ''
  };

  onFiltersChanged(filters: typeof this.activeFilters) {
    this.activeFilters = filters;
  }
}
