import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';

// アンダースコア_を含めてgenerate componentした場合はハイフンに置換される。
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() hero: Hero;

}
