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

  private threadhold: number = 10;

  heros: Hero[];

  // TODO: 画像の参照方法。以下のURLは404になる。
  imageUrl: string = './hello.png';

  // Heroのリストが凍結されているかどうか。
  frozen: boolean = false;

  constructor(private heroService: HeroService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadHeros();
    
    // 外部スクリプトが読み込まれていることの確認
    console.log($('#scriptcontainer'));

    // 今のところ動的なインラインスクリプト以外解釈されない。
    const script = document.createElement('script');
    script.type = 'module';
    script.text = `console.info('Image URL: ${this.imageUrl}');`;
    const container = document.getElementById('scriptcontainer');
    container.appendChild(script);

    // スクリプトが読み込まれないためonloadは呼び出されない。
    // script.onload = () => {
    //   console.log('Module loaded');
    //   container.appendChild(script);
    // };
    // script.onerror = err => {
    //   console.error(err);
    // };
    // script.src = 'https://localhost/webxam/ecmascript/importexport/mod.js';

    // ローカルのディレクトリを探しに行ってしまいエラーになる。
    //import('https://localhost/webxam/ecmascript/importexport/mod.js')
    //  .then(module => console.log(module));
  }

  getThreadhold(): number {
    return this.threadhold;
  }

  loadHeros(): void {
    const func = heros => this.heros = heros;
    this.heroService.getHeros().subscribe(func.bind(this));
  }

  add(heroName: string): void {
    const name = heroName.trim();
    if (this.frozen || !name) {
      return;
    }
    // asによる型変換ではプロパティを有しているかしか見ていないようだ。
    // 型変換においてはダックタイピングできるかどうかしか考慮されないということ。
    const hero = { name } as Hero;
    const pushHero = hero => this.heros.push(hero);
    this.heroService.addHero(hero).subscribe(pushHero);
  }

  // 削除処理に成功した時だけherosプロパティの更新を行う。
  // 参考: 
  // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md
  delete(hero: Hero): void {
    this.heroService.deleteHero(hero)
      .subscribe(
        _ => {
          console.log(`Hero delete success: id=${hero.id}`);
          this.heros = this.heros.filter(h => h !== hero);
        },
        error => console.error(`Hero delete error: ${error.message}`),
        () => console.log('Hero delete request completed')
      );
  }
}

