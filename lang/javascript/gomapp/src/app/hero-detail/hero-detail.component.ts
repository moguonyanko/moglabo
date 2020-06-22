import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

// アンダースコア_を含めてgenerate componentした場合はハイフンに置換される。
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private heroService: HeroService
  ) { }

  ngOnInit(): void {
    this.loadHearos();
  }

  @Input() hero: Hero;

  loadHearos(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    const func = (hero => this.hero = hero).bind(this);
    this.heroService.getHero(id).subscribe(func);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

}
