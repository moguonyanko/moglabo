/**
 * 重い処理を行うテスト用のスクリプトです。
 */

self.onmessage = function (evt) {
	var n = parseInt(evt.data);
	var result = fib(n);
	self.postMessage(result);
};

function fib(n) {
	if (n <= 1) {
		return n;
	}

	return fib(n - 1) + fib(n - 2);
}
