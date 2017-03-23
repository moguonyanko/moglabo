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
	
	const getExamIntArray = size => {
		const buffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * size);
		const intArray = new Int32Array(buffer);
		
		/**
		 * TypedArrayを使う必要は無いがTypedArrayをWorkerに渡せることを
		 * 確認するために使っている。
		 */
		intArray[0] = parseInt(doc.querySelector(".example2 .initial").value);
		intArray[1] = parseInt(doc.querySelector(".example2 .limit").value);
		intArray[2] = parseInt(doc.querySelector(".example2 .step").value);
			
		return intArray;
	};
	
	const initExam2 = () => {
		template("example2", ({size, result}) => {
			const intArray = getExamIntArray(size);
			const worker2 = new Worker("examworker2.js");
			const onmessage = evt => {
				const data = evt.data;
				result.innerHTML += `result value = ${data.value}<br />`;
				/* worker2_1の処理により値が変更されている「かもしれない」 */
				result.innerHTML += `modified initial value = ${data.source[0]}<br />`;
				worker2.terminate();
			};
			worker2.addEventListener("message", onmessage);
			
			/* Int32Arrayの要素を変更するWorker */
			const worker2_1 = new Worker("examworker2_1.js");
			worker2_1.postMessage(intArray);
			
			worker2.postMessage(intArray);
		});
	};
	
	const initExams = () => {
		initExam1();
		initExam2();
	};
	
	win.addEventListener("DOMContentLoaded", initExams);
})(window, document, goma));
