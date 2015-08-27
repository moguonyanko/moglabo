(function(win, doc, m, factory){
	/**
	 * "use strict"をここに記述しても引数の関数内部には影響を与えられない。
	 */
	
	var mygenerator = win.mygenerator;

	if(typeof mygenerator === "object" && typeof mygenerator.init === "object"){
		m.log(navigator.userAgent + "ではmygenerator名前空間の初期化は完了しています。");
	}else{
		win.mygenerator = factory(win, doc, m);
	}
	
}(window, document, my, function (win, doc, m) {
	"use strict";
	
	/**
	 * アスタリスクをfunctionキーワードの後ろに付けることで
	 * ジェネレータ関数を定義する。yield式を含む関数の宣言部に
	 * アスタリスクが付いていないとChrome44ではシンタックスエラーになる。
	 */
	function* createCounter(limit) {
		for (var i = 0; i < limit; i++) {
			yield i + 1;
		}
	}

	function initCounter() {
		var limit = 10;

		var nowCounter = createCounter(limit);

		var countGetter = m.ref("get-generator-count"),
			countResult = m.ref("count-result");

		m.addListener(countGetter, "click", function (evt) {
			try {
				/**
				 * ジェネレータの最新の値はvalueプロパティから取得する。
				 */
				var num = nowCounter.next().value;
				countResult.value = num;
			} catch (err) {
				if (err instanceof StopIteration) {
					countResult.value = "リセットして下さい";
					countGetter.disabled = "disabled";
				} else {
					throw err;
				}
			}
		}, false);

		m.addListener(m.ref("reset-generator-count"), "click", function (evt) {
			nowCounter = createCounter(limit);
			countResult.value = "";
			countGetter.disabled = null;
		}, false);
	}

	function* createMyReader(ws, lineSize) {
		if (ws.readyState !== WebSocket.OPEN) {
			return;
		}
		
		/**
		 * 無限ループにすることによってStopIterationを送出させない。
		 * ジェネレータのnextメソッドに渡された引数はyield式の左辺で受け取られる。
		 * この時のnextメソッドの戻り値のvalueプロパティにはyield式の左辺値が
		 * 割り当てられる。
		 */
		while(true)	{
			let newSize = yield lineSize;
			ws.send(newSize);
		}
	}
	
	function getLineSize(){
		var size = parseInt(m.ref("read-byte-size").value);
		
		if(!isNaN(size) && size >= 1){
			return size;
		}else{
			return 1;
		}
	}

	function initFileReader() {
		var resultArea = m.ref("result-read-area"),
			ws = null,
			reader = null;

		/**
		 * @todo
		 * WebSocketをopenした直後は2回ボタンをクリックしないと
		 * ファイルを読まない。
		 */
		m.clickListener("run-file-reader", function () {
			if (ws === null || ws.readyState !== WebSocket.OPEN) {
				ws = m.createWebSocket("myreader");

				ws.onopen = function () {
					reader = createMyReader(this, getLineSize());
					var val = reader.next().value;
					m.log(val + "行から読み始めます。");
				};

				ws.onclose = function (evt) {
					m.log(evt);
					m.println(resultArea, "ファイルを閉じました。" + evt.reason);
				};
				
				ws.onmessage = function (evt) {
					m.log(evt.data);
					var res = JSON.parse(evt.data);
					m.println(resultArea, res.result);
				};

				ws.onerror = function (evt) {
					m.println(resultArea, "読み込み失敗");
				};
			}else{
				/**
				 * nextメソッドに引数を渡せばyield式に引数を渡すことができる。
				 * sendメソッドはECMAScript6の標準には存在しない。
				 */
				reader && reader.next(getLineSize());
			}
		});

		m.clickListener("close-file-reader", function () {
			if (ws !== null) {
				ws.close();
			}
		});

		m.clickListener("clear-read-result", function () {
			m.print(resultArea, "", true);
		});
	}

	function init() {
		initCounter();
		initFileReader();
	}

	return {
		init : init
	};
	
}
));

