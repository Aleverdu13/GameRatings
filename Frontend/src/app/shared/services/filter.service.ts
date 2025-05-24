import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filter } from '../../interfaces/filter.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<Filter>({
    category: '',
    year: '',
    scoreMin: 0,
    scoreMax: 100,
    platform: '',
    search: ''
  });

  filters$ = this.filtersSubject.asObservable();

  setFilters(filters: Filter): void {
    this.filtersSubject.next(filters);
  }
}
