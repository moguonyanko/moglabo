import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROS } from './mock_heros';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private herosUrl = 'api/heros';

  constructor(private messageService: MessageService,
    private http: HttpClient) { }

  private log(content: string): void {
    this.messageService.add(`${content}, ${new Date().toString()}`);
  }

  private handleError<T>(opeation: string = 'operation', defaultResult?: T) {
    const handler = (error: any): Observable<T> => {
      console.error(error);
      this.log(`エラー発生:${opeation},${error.message}`);
      return of(defaultResult as T);
    };
    return handler;
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.herosUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`HeroService Fetched: ID=${id}`)),
      catchError(this.handleError<Hero>(`Error at getHero: id=${id}`))
    );
  }

  getHeros(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.herosUrl)
      .pipe(
        tap(heros => this.log('Heros fetched')),
        catchError(this.handleError<Hero[]>('getHeros', []))
      );
  }
}
