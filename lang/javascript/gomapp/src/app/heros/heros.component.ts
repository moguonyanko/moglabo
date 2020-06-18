import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

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

  hero = {
    id: 1,
    name: 'Usao'
  };

  heros: Hero[];

  constructor(private heroService: HeroService, 
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadHeros();
  }

  selectedHero: Hero;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`${hero.name} selected: ${new Date().toString()}`);
  }

  setHeros(heros: Hero[]): void {
    this.heros = heros;
  }

  loadHeros(): void {
    const f = this.setHeros.bind(this);
    this.heroService.getHeros().subscribe(f);
  }

}

