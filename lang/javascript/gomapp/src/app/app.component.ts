import { Component } from '@angular/core';

/**
 * 参考:
 * https://angular.jp/tutorial/
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // templateUrlが指定されている場合は無視される。
  template: `<h2>お気に入りは{{myHero}}です</h2>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  myHero: string;

  constructor() {
    this.title = 'Go My Application';
    this.myHero = 'Momotaro';
  }
}
