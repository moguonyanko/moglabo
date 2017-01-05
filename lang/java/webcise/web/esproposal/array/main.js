((win, doc, g) => {
	"use strict";
	
	/**
	 * DOMにアクセスしない即ちECMAScriptで完結できるコードは分離する。
	 */
	const getRandomValues = (seed, size) => {
		/**
		 * Arrayでは引数の値のサイズを持つ配列が返される。この時各要素はnullで
		 * 初期化される。しかし配列は空として扱われるので巡回することができない。
		 * そこでArray.prototype.fillを使い適当な値(ここではゼロ)を割り当てることで
		 * 空ではない巡回できる配列を作っている。
		 * Array.ofでは引数に渡した値を要素として持つ配列が返される。
		 */
		const values = Array(size).fill(0).map(() => {
			return parseInt(Math.random(seed) * seed);
		});
		
		return values;
	};
	
	const funcs = {
		arrayIncludesSample() {
			const base = ".array-includes-sample ";
			const { runner, clearer, output } = g.getCommonUI(base);
			const input = g.select(base + ".target");
			const initializer = g.select(base + ".initializer");
			
			const seed = 100;
			const srcSize = 10;
		
			let values;
		
			const initSrc = size => {
				const src = g.select(base + ".source");
				values = getRandomValues(seed, size);
				src.innerHTML = values.map(v => " " + v).toString();
			};
			
			initializer.addEventListener("click", () => initSrc(srcSize));
			
			runner.addEventListener("click", () => {
				const target = parseInt(input.value);
				if (!isNaN(target)) {
					const result = values.includes(target);
					g.println(output, result);
				}
			});
			
			clearer.addEventListener("click", () => g.clear(output));
			
			initSrc(srcSize);
		}
	};
	
	win.addEventListener("DOMContentLoaded", () => g.init(funcs));
})(window, document, goma);
