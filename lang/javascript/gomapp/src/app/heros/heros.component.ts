import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { catchError } from 'rxjs/operators';

/**
 * 参考:
 * https://angular.jp/tutorial/
 */

@Component({
  selector: 'app-heros',
  templateUrl: './heros.component.html',
  styleUrls: ['./heros.component.css']
})

export class HerosComponent implements OnInit {

  heros: Hero[];

  constructor(private heroService: HeroService, 
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadHeros();
  }

  loadHeros(): void {
    const func = heros => this.heros = heros;
    this.heroService.getHeros().subscribe(func.bind(this));
  }

  add(heroName: string): void {
    const name = heroName.trim();
    if (!name) {
      return;
    }
    // asによる型変換ではプロパティを有しているかしか見ていないようだ。
    // 型変換においてはダックタイピングできるかどうかしか考慮されないということ。
    const hero = { name } as Hero;
    const pushHero = hero => this.heros.push(hero);
    this.heroService.addHero(hero).subscribe(pushHero);
  }

  delete(hero: Hero): void {
    // TODO: 削除リクエストが成功した時だけherosの更新を行いたい。
    this.heros = this.heros.filter(h => h !== hero);
    this.heroService.deleteHero(hero)
      .subscribe();
  }
}

