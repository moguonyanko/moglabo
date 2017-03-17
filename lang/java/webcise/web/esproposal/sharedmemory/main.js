(((win, doc, g) => {
	"use strict";
	
	const initExam1 = () => {
		const base = doc.querySelector(".example1"),
			runner = base.querySelector(".runner"),
			clearer = base.querySelector(".clearer"),
			result = base.querySelector(".result"),
			memSize = base.querySelector(".memorysize");
		
		runner.addEventListener("click", () => {
			const size = parseInt(memSize.value);
			
			if (!isNaN(size)) {
				const buffer = new SharedArrayBuffer(size);
				const worker = new Worker("examworker1.js");
				const onmessage = evt => {
					const data = evt.data;
					result.innerHTML += `byte size = ${data.size} byte<br />`;
					worker.terminate();
				};
				worker.addEventListener("message", onmessage);
				worker.postMessage(buffer);
			}
		});
		
		clearer.addEventListener("click", () => {
			result.innerHTML = "";
		});
	};
	
	const initExams = () => {
		initExam1();
	};
	
	win.addEventListener("DOMContentLoaded", initExams);
})(window, document, goma));
