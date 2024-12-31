/**
 * @fileoverview PageRevealEventを試すためのスクリプト
 * 参考:
 * https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API/Using#javascript_%E3%82%92%E6%B4%BB%E7%94%A8%E3%81%97%E3%81%9F%E7%8B%AC%E8%87%AA%E3%81%AE%E6%96%87%E6%9B%B8%E5%86%85_spa_%E9%81%B7%E7%A7%BB
 * https://mdn.github.io/dom-examples/view-transitions/spa/#
 */

// 最後のクリックイベントを格納
let lastClick;
addEventListener("click", (event) => (lastClick = event));

function spaNavigate(data) {
  // この API に対応していないブラウザー用の代替処理
  if (!document.startViewTransition) {
    updateTheDOMSomehow(data);
    return;
  }

  // クリック位置を取得し、失敗時は画面の中央にする
  const x = lastClick?.clientX ?? innerWidth / 2;
  const y = lastClick?.clientY ?? innerHeight / 2;
  // 最も遠い角までの距離を取得
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );

  // 遷移を作成
  const transition = document.startViewTransition(() => {
    updateTheDOMSomehow(data);
  });

  // 擬似要素が作成されるまで待つ
  transition.ready.then(() => {
    // ルート要素の新しいビューをアニメーション
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0 at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in",
        // Specify which pseudo-element to animate
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}

