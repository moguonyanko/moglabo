(function(win, doc, m) {
	"use strict";

	var resultArea = m.ref("promise-result-area"),
		timeoutEle = m.ref("promise-timeout-seconds");

	var separator = ",";

	/**
	 * Promiseの処理中にエラーが発生した時はthenに渡した関数は
	 * 自分で直接呼び出していない限り呼び出されない。
	 */
	function resolve(res) {
		m.println(resultArea, "計算結果=" + res.result);
	}

	/**
	 * Promiseの処理中にエラーが発生した時はどこで発生した場合でも
	 * rejectが呼び出される。この時の引数はErrorあるいはそのサブタイプの
	 * オブジェクトになっている。
	 */
	function reject(err) {
		m.println(resultArea, err.message);
		/**
		 * Firefox39ではthrowされたErrorがブラウザのデバッガに通知されるまでに
		 * 数秒から数十秒かかる。
		 */
		throw err;
	}

	/**
	 * thenに渡す関数はPromiseのコンストラクタ関数に渡した関数内で
	 * 直接呼び出していなくも，Promiseの処理が終われば呼び出される。
	 * この時の呼び出される関数の引数はundefinedになっている。
	 */
	function logging(res) {
		var date = new Date(),
			status = res ? res.status : "",
			msg = res ? res.message : "";

		var logs = [
			date,
			"Promiseによる計算が終了しました。",
			msg
		];

		if (status) {
			logs.push(status);
		}

		m.log(logs.join(separator));
	}

	function PromiseError(baseMsg, result) {
		this.result = result || {};
		//this.message = PromiseError.formatMessage(baseMsg, this.result);
		this.rawMessage = baseMsg;
	}

	/**
	 * definePropertiesを使わず以下の静的メソッドを使うことでも
	 * エラーメッセージの整形は行える。ただし静的メソッドだと公開されてしまう。
	 * 静的メソッドが完全にオブジェクト内部で使うためだけのヘルパーメソッドで
	 * あった場合はdefinePropertiesを使う方が良いかもしれない。
	 */
//	PromiseError.formatMessage = function(message, result) {
//		var msg = [
//			message,
//			result.status
//		];
//
//		return msg.join(" ");
//	};

	PromiseError.prototype = Object.create(Error.prototype);

	Object.defineProperties(PromiseError.prototype, {
		message : {
			get : function() {
				var msg = [
					this.rawMessage,
					this.getStatus()
				];

				return msg.join(" ");
			},
			enumerable : true, 
			configurable : false
		}
	});

	PromiseError.prototype.getStatus = function() {
		return this.result.status;
	};

	function promiseFunc(resolve, reject) {
		m.log(new Date() + separator + "Promiseの準備を開始します。");

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
						reject(new PromiseError("calculation failed", res));
					}
				} catch (parseErr) {
					/**
					 * @todo
					 * こちらのrejectが呼び出されるとontimeout等のハンドラが呼び出されない。
					 */
					reject(new PromiseError(parseErr.message));
				}
			}
		};
		xhr.onerror = function() {
			reject(new PromiseError("http error!"));
		};
		xhr.ontimeout = function() {
			reject(new PromiseError("timeout!"));
		};
		xhr.send(null);
	}

	function run() {
		var promise = new Promise(promiseFunc);

		m.log(new Date() + separator + "Promiseが作成されました。");

		/**
		 * Promiseの成否に関わらず呼び出したい関数はthenとcatchの両方に
		 * 渡しておかなければならない。finally的な関数は無いのか？
		 */
		promise.then(resolve)
			.then(logging)
			.catch(reject)
			.catch(logging);

		m.log(new Date() + separator + "Promiseの関数を設定しました。");
	}

	(function() {
		m.addListener(m.ref("promise-runner"), "click", run, false);

		m.addListener(m.ref("clear-promise-element"), "click", function() {
			m.print(resultArea, "", true);
		}, false);
	}());

}(window, document, my));
