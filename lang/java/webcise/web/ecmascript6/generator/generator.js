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
     * 
     * ジェネレータ関数をArrow Functionで記述するとスクリプト読み込み時に
     * エラーになってしまう。
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

    /**
     * @description 
     * ファイル読み込みを行うジェネレータ関数です。
     */
	function* createMyReader(ws, lineSize) {
		if (ws.readyState !== WebSocket.OPEN) {
			return;
		}
		
        /**
         * ここでWebSocket.sendを実行しなければジェネレータ関数を
         * 最初に実行した時にファイルの読み込みが行われない。そのため
         * もう1回読み込みボタンを押す必要が生じる。
         */
        ws.send(lineSize);
        
		/**
         * ジェネレータ関数の2回目以降のnextで評価されるのは
         * 以下のwhileブロック内のコードだけである。
		 * 無限ループさせることでStopIterationを送出させないようにしている。
		 * ジェネレータのnextメソッドに渡された引数はyield式の右辺に渡せる。
		 * nextメソッドの戻り値のvalueプロパティにはyield式に渡した値が
		 * 保存される。
		 */
		while(true)	{
			let newSize = yield lineSize;
			ws.send(newSize);
            m.log(newSize + "行読み込みました。");
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
	
	function getPort(){
		var portEle = my.ref("read-byte-port");
		return portEle.value;
	}

	function initFileReader() {
		var resultArea = m.ref("result-read-area"),
			ws = null,
			reader = null;

		m.clickListener("run-file-reader", function () {
			if (ws === null || ws.readyState !== WebSocket.OPEN) {
    			m.println(resultArea, "接続を開始します。");
                
				ws = m.createWebSocket("myreader", {
					port : getPort()
				});

				ws.onopen = function () {
					reader = createMyReader(this, getLineSize());
                    /**
                     * このnextではWebSocket.sendされない。
                     * nextに引数を渡してもWebSocket.sendされない。
                     */
					var val = reader.next().value;
					m.log(val + "行ずつ読み込みます。");
				};

				ws.onclose = function (evt) {
					m.log(evt);
					m.println(resultArea, "接続を終了しました。" + evt.reason);
				};
				
				ws.onmessage = function (evt) {
					m.log(evt.data);
					var res = JSON.parse(evt.data);
                    
                    if(res.result !== "EOF"){
    					m.print(resultArea, res.result);
                    }else{
    					m.println(resultArea, "ファイルは全て読み込まれました。接続を終了します。");
                        this.close();
                    }
				};

				ws.onerror = function (evt) {
					m.println(resultArea, "ファイルの読み込みに失敗しました。");
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

