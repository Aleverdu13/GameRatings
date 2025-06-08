import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  private langSubject = new BehaviorSubject<'en' | 'es'>('en');
  lang$ = this.langSubject.asObservable();

  getLang(): 'en' | 'es' {
    return this.langSubject.value;
  }

  setLang(newLang: 'en' | 'es') {
    this.langSubject.next(newLang);
  }
}
