import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private herosUrl = 'api/heros';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

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

  updateHero(hero: Hero): Observable<any> {
    const observable = this.http.put(this.herosUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Update hero: id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
    return observable;
  }

  addHero(hero: Hero): Observable<Hero> {
    const observable = this.http.post<Hero>(this.herosUrl, hero, this.httpOptions)
      .pipe(
        tap((addedHero: Hero) => this.log(`Added new hero: id=${addedHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
    return observable;
  }

  deleteHero(hero: Hero): Observable<Hero> {
    const url = `${this.herosUrl}/${hero.id}`;
    // deleteの後ろの型パラメータ指定<Hero>が無ければコンパイルエラーとなる。
    const observable = this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Deleted hero: id=${hero.id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
    return observable;
  }

  searchHeros(hint: string): Observable<Hero[]> {
    const term = hint.trim();
    if (!term) {
      return of([]);
    }
    const url = `${this.herosUrl}/?name=${term}`;
    const observable = this.http.get<Hero[]>(url)
      .pipe(
        tap(_ => this.log(`Found hero: matchd term=${term}`)),
        catchError(this.handleError<Hero[]>('searchHeros', []))
      );
    return observable;
  }
}
