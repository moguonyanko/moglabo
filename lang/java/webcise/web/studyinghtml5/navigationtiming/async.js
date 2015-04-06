/**
 * 非同時スクリプト読み込み時のパフォーマンス調査用スクリプトです。
 * 
 */

(function(m) {
	"use strict";

	(function() {

		var message = "ここでコストの大きい非同期処理を行うと，" + 
			"DOMContentLoadedイベント完了時間と" +
			"loadイベント完了時間の差を大きくなる。";
		m.log(message);

	}());

}(my));
