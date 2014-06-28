(function(w, d) {

	function ref(id, node) {
		return (node || d).getElementById(id);
	}

	function Progress() {
		var progress = ref("sampleprogress"),
			progressSwitch = ref("progressswitch"),
			innerValue = ref("progressvalue"),
			interval = 100,
			intervalId = null;

		function updateProgress() {
			var currentValue = parseInt(progress.getAttribute("value")),
				maxValue = parseInt(progress.getAttribute("max"));
			
			var value = currentValue + 1;

			if (value > maxValue) {
				innerValue.innerHTML = 0;
				progress.setAttribute("value", 0);
			} else {
				innerValue.innerHTML = value;
				progress.setAttribute("value", value);
			}
		}

		function startProgress(){
			intervalId = setInterval(updateProgress, interval);
			progressSwitch.removeEventListener("click", startProgress, false);
			progressSwitch.addEventListener("click", stopProgress, false);
		}

		function stopProgress() {
			clearInterval(intervalId);
			progressSwitch.removeEventListener("click", stopProgress, false);
			progressSwitch.addEventListener("click", startProgress, false);
		}

		this.init = function() {
			startProgress();
		};
	}

	var myModules = {
		progress: Progress
	};

	function init() {
		for (var name in myModules) {
			if (myModules[name]) {
				var myModule = new myModules[name]();

				myModule.init();
			}
		}
	}

	init();

}(window, document));
