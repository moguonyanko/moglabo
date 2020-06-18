import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  heros: Hero[] = [];

  constructor(private heroService: HeroService) { }

  loadHeros(): void {
    const func = heros => this.heros = heros.slice(0, 4);
    this.heroService.getHeros().subscribe(func.bind(this));
  }

  ngOnInit(): void {
    this.loadHeros();
  }
  
}
