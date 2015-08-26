(function (win, doc, m) {
	"use strict";

	function createCounter(limit) {
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
				var num = nowCounter.next();
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

	function createMyReader(ws, lineSize) {
		if (ws.readyState !== WebSocket.OPEN) {
			return;
		}
		
		/**
		 * 無限ループにすることによってStopIterationを送出させない。
		 * ジェネレータのsendメソッドに渡された引数はyield式の左辺で受け取られる。
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
		 * WebSocketをopenした直後は3回ボタンをクリックしないと
		 * ファイルを読まない。
		 */
		m.clickListener("run-file-reader", function () {
			if (ws === null || ws.readyState !== WebSocket.OPEN) {
				ws = m.createWebSocket("myreader");

				ws.onopen = function () {
					reader = createMyReader(this, getLineSize());
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
				reader && reader.send(getLineSize());
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

	m.addListener(doc, "DOMContentLoaded", init, false);

}(window, document, my));
