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
}

