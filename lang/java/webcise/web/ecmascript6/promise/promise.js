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
		/**
		 * Object.freezeはenumerableをfalse(列挙不可)にはしない。
		 * 列挙も不可にしたい場合はdefineProperty等を使い自分で
		 * enumerableをfalseにする。
		 * 
		 * 本当に公開したくないprivateなプロパティは，書き込み(writable)と
		 * 設定(configurable)を不可にするだけでなく列挙(enumerable)も不可にする。
		 * なお設定不可のオブジェクトを後からdefinePropertyで
		 * 列挙不可に設定することはできない。
		 */
		Object.defineProperties(this, {
			/**
			 * 元のエラーメッセージを保持するrawMessageプロパティは，
			 * ・書き込み不可
			 * ・列挙不可
			 * ・設定不可(プロパティの追加，編集，削除不可)
			 * にする。
			 */
			rawMessage : {
				value : baseMsg,
				writable : false,
				enumerable : false,
				configurable : false
			},
			result : {
				value : result || {},
				writable : false,
				enumerable : true,
				configurable : false
			}
		});
	}

	PromiseError.prototype = Object.create(Error.prototype);

	/**
	 * definePropertiesを使わず静的なヘルパーメソッドを使うことでも
	 * エラーメッセージの整形は行える。ただし静的メソッドは公開される。
	 * 静的メソッドがオブジェクト内部で使うためだけのヘルパーメソッドだった場合は
	 * definePropertyやdefinePropertiesを使ってプロパティ記述子を
	 * 設定する方が良いかもしれない。
	 */
	Object.defineProperties(PromiseError.prototype, {
		message : {
			get : function() {
				var msg = [
					this.rawMessage,
					this.getStatus()
				];

				return msg.join(" ");
			},
			/**
			 * rawMessageを列挙不可にし整形されたmessageを列挙可にする。
			 */
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
