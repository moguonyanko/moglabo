import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heros$: Observable<Hero[]>;
  // SubjectはObservableを拡張している。
  private searchHint = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    const heros = this.searchHint.pipe(
      // 入力後500ms待機する。
      debounceTime(500),
      // 入力値に変更がなければ何もしない。
      distinctUntilChanged(), 
      // 入力値が変更されるたびに検索を試みる。
      switchMap((hint: string) => this.heroService.searchHeros(hint))
    );
    this.heros$ = heros;
  }

  search(hint: string): void {
    // Observableストリームに検索対象文字列がpushされる。
    this.searchHint.next(hint);
  }
}
