(function(win, doc, m) {
	"use strict";

	var resultArea = m.ref("promise-result-area"),
		timeoutEle = m.ref("promise-timeout-seconds");
		
	function resolve(res) {
		m.println(resultArea, "計算結果=" + res.result);
		m.log(new Date() + ":Promiseによる計算が成功しました。");
	}

	function reject(err) {
		m.println(resultArea, err);
		m.log(new Date() + ":Promiseによる計算が失敗しました。\n" + err.message);
		/**
		 * Firefox39ではthrowされたErrorがブラウザのデバッガに通知されるまでに
		 * 数秒から数十秒かかる。
		 */
		throw err;
	}

	function promiseFunc(resolve, reject) {
		m.log(new Date() + ":Promiseの準備を開始します。");

		var urlParts = [
			"/webcise/Calculator?"
		];
		var params = m.values(m.refs("promise-parameter"));
		for (var i = 0, len = params.length; i < len; i++) {
			urlParts.push("parameter=" + params[i]);
		}
		var op = m.selected(m.refs("promise-operator"));
		urlParts.push("operator=" + op);
		var url = urlParts.join("&");

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.timeout = timeoutEle.value;
		xhr.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				try {
					var res = JSON.parse(this.responseText);
					if (res.status === 200) {
						resolve(res);
					} else {
						var err = new Error("calculation failed, status=" + res.status);
						reject(err);
					}
				} catch (parseErr) {
					/**
					 * @todo
					 * こちらのrejectが呼び出されるとontimeout等のハンドラが呼び出されない。
					 */
					reject(parseErr);
				}
			}
		};
		xhr.onerror = function() {
			var err = new Error("http error!");
			reject(err);
		};
		xhr.ontimeout = function() {
			var err = new Error("timeout!");
			reject(err);
		};
		xhr.send(null);
	}

	function run() {
		var promise = new Promise(promiseFunc);

		m.log(new Date() + ":Promiseが作成されました。");

		promise.then(resolve)
			.catch(reject);

		m.log(new Date() + ":Promiseの関数を設定しました。");
	}

	(function() {
		m.addListener(m.ref("promise-runner"), "click", run, false);

		m.addListener(m.ref("clear-promise-element"), "click", function() {
			m.print(resultArea, "", true);
		}, false);
	}());

}(window, document, my));
