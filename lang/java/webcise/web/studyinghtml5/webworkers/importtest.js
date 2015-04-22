/**
 * 共有ライブラリの読み込みを試みる。
 * スクリプトの読み込みが完了するまでは処理が進まない(はず)。
 */
self.importScripts("sharedlibrary.js");

function workerLibTest(args) {
	self.postMessage({
		sharedResult : self.myMath[args.operation].apply(null, args.values),
		sentence : args.sentence + ", Worker!"
	});
}

self.onmessage = function(evt) {
	workerLibTest(evt.data);
};
