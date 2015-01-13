/**
 * 重い処理を行うテスト用のスクリプトです。
 * このスクリプト内でWindowオブジェクトを参照すると
 * エラーになります。
 */

/**
 * Windowオブジェクトの直下に保存されるように
 * このスクリプトが読み込まれれば，この関数は
 * 外部スクリプトから参照可能になる。
 */
function fib(n) {
	if (n <= 1) {
		return n;
	}

	return fib(n - 1) + fib(n - 2);
}

function download() {
	var xhr = new XMLHttpRequest(),
		async = false;

	/* Worker内部では同期リクエストしてもWebページの動作をブロックしない。 */
	xhr.open("GET", "sample.json", async);
	xhr.send();
	if (xhr.status === 200) {
		/**
		 * JSONオブジェクトのメソッドでシリアライズできるオブジェクトであれば
		 * postMessageの引数に渡すことができる。
		 */
		self.postMessage({
			result: xhr.responseText
		});
	}
}

/**
 * 以下の関数群は本来は各々のスクリプトに分けるべきである。
 */
var messageHandler = {
	fib: function (arg) {
		var n = parseInt(arg);
		var result = fib(n);
		self.postMessage({
			result: result
		});
	},
	download: download
};

self.onmessage = function (evt) {
	var handlerName = evt.data.handler,
		handler = messageHandler[handlerName];
	handler(evt.data.arg);
};
