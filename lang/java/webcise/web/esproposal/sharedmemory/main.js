(((win, doc, g) => {
	"use strict";
	
	const getElements = baseClass => {
		const base = doc.querySelector("." + baseClass),
			runner = base.querySelector(".runner"),
			clearer = base.querySelector(".clearer"),
			result = base.querySelector(".result"),
			memory = base.querySelector(".memory");
			
		return { base, runner, clearer, result, memory };
	};
	
	const template = (baseClass, onClickListener) => {
		const { base, runner, clearer, result, memory } = getElements(baseClass);
		
		runner.addEventListener("click", () => {
			const size = parseInt(memory.value);
			if (!isNaN(size)) {
				onClickListener({ size, result });
			}
		});
		
		clearer.addEventListener("click", () => {
			result.innerHTML = "";
		});
	};
	
	const initExam1 = () => {
		template("example1", ({ size, result }) => {
			const buffer = new SharedArrayBuffer(size);
			const worker = new Worker("examworker1.js");
			const onmessage = evt => {
				const data = evt.data;
				result.innerHTML += `byte size = ${data.size} byte<br />`;
				worker.terminate();
			};
			worker.addEventListener("message", onmessage);
			worker.postMessage(buffer);
		});
	};
	
	const initExam2 = () => {
		template("example2", ({size, result}) => {
			const buffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * size);
			const intArray = new Int32Array(buffer);
			
			/* test values */
			const initial = 100,
				limit = 200,
				step = 10;
				
			intArray[0] = initial;
			intArray[1] = limit;
			intArray[2] = step;
			
			const worker = new Worker("examworker2.js");
			const onmessage = evt => {
				const data = evt.data;
				result.innerHTML += `result value = ${data.value}<br />`;
				worker.terminate();
			};
			worker.addEventListener("message", onmessage);
			worker.postMessage(intArray);
		});
	};
	
	const initExams = () => {
		initExam1();
		initExam2();
	};
	
	win.addEventListener("DOMContentLoaded", initExams);
})(window, document, goma));
