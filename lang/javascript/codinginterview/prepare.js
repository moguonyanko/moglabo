(function (win, doc) {
	'use strict';

	var runners = doc.querySelectorAll('main .CodeRunners button'),
		runTest = function (evt) {
			var src = evt.target.value;

			var testScriptEle = doc.createElement('script');
			testScriptEle.onload = function(){
				doc.body.removeChild(testScriptEle);
			};
			testScriptEle.src = src;
			doc.body.appendChild(testScriptEle);
		};

	for (var i = 0, max = runners.length; i < max; i++) {
		var runner = runners[i];
		runner.addEventListener('click', runTest, false);
	}
}(window, document));