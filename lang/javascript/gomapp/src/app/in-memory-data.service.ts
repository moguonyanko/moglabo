import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

/**
 * 参考:
 * https://angular.jp/tutorial/toh-pt6
 */

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  static DEFAULT_ID: number = 111;

  createDb() {
    const heros = [
      { id: InMemoryDataService.DEFAULT_ID, name: 'Hoge' },
      { id: 112, name: 'Fuga' },
      { id: 113, name: 'Foo' },
      { id: 114, name: 'Bar' },
      { id: 115, name: 'Baz' },
      { id: 116, name: 'Kitezo' },
      { id: 117, name: 'Monchi' },
      { id: 118, name: 'Taro' },
      { id: 119, name: 'Jiro' },
      { id: 120, name: 'Usao' },
      { id: 121, name: 'Popen' },
      { id: 122, name: 'Pupuk' }
    ];
    // プロパティ名がHeroService.herosUrlのapi以下と一致していないとエラーになる。
    return { heros };
  }

  createId(heros: Hero[]): number {
    let id = InMemoryDataService.DEFAULT_ID;
    
    if (heros.length > 0) {
      id = Math.max(...heros.map(hero => hero.id)) + 1;
    }

    return id;
  }
}