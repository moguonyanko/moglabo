(function(win, doc, m) {
	"use strict";

	function createCounter(limit) {
		for (var i = 0; i < limit; i++) {
			yield i + 1;
		}
	}

	function initCounter(){
		var limit = 10;
		
		var nowCounter = createCounter(limit);
		
		var countGetter = m.ref("get-generator-count"),
			countResult = m.ref("count-result");
		
		m.addListener(countGetter, "click", function(evt) {
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

		m.addListener(m.ref("reset-generator-count"), "click", function(evt) {
			nowCounter = createCounter(limit);
			countResult.value = "";
			countGetter.disabled = null;
		}, false);
	}

	function init() {
		initCounter();
	}

	m.addListener(doc, "DOMContentLoaded", init, false);

}(window, document, my));
