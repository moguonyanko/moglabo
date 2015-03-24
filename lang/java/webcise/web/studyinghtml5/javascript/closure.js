(function(doc) {
	"use strict";

	var btns = doc.querySelectorAll(".ClosureButton");

	for (var i = 0; i < btns.length; i++) {
		btns[i].onclick = (function(x) {
			return function() {
				this.innerHTML = x + 1;
			};
		}(i));

//		btns[i].onclick = (function(x, that) {
//			return function() {
//				that.innerHTML = x + 1;
//			};
//		}(i, btns[i]));
	}
}(document));