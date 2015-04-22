/**
 * 読み込みテスト用の共有ライブラリ
 * 
 * Workerで使われるかどうかを気にせずに共有したいライブラリは
 * windowではなくselfを参照すること。
 * 当然ライブラリはDOMを参照できない。
 */

(function(sl) {
	"use strict";
	
	function add(a, b) {
		return a + b;
	}

	function sub(a, b) {
		return a - b;
	}

	function mul(a, b) {
		return a * b;
	}

	function div(a, b) {
		return a / b;
	}

	/**
	 * selfのプロパティとしてライブラリを公開する。
	 */
	sl.myMath = {
		add : add,
		sub : sub,
		mul : mul,
		div : div
	};
}(self));
