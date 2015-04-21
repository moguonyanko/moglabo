(function (win, doc, m) {
	"use strict";

	var workerEle = m.ref("worker-shared-library"),
		area = m.ref("worker-shared-result"),
		testRunner = m.ref("shared-test-runner");

	(function () {
		m.addListener(testRunner, "click", function () {
			var bb = new Blob(
				[workerEle.textContent],
				{
					type: "text/javascript"
				});
				
			var url = win.URL.createObjectURL(bb);
			
			var worker = new Worker(url);
			worker.postMessage({
				sentence : "Hello "
			});
			worker.onmessage = function(evt){
				var data = evt.data;
				m.log(data);
				m.println(area, data.sentence, true);
				win.URL.revokeObjectURL(bb);
			};
		}, false);
	}());

}(window, document, my));
