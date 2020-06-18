import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROS } from './mock_heros';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService Fetched: ID=${id}, ${new Date().toString()}`);
    return of(HEROS.find(hero => hero.id === id));
  }

  getHeros(): Observable<Hero[]> {
    return of(HEROS);
  }
}
