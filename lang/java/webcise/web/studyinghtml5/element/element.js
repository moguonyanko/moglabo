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

		function startProgress() {
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

	function Dataset() {
		var customDataList = ref("customdatalist"),
			customDatas = customDataList.getElementsByTagName("li"),
			outputArea = ref("outputarea"),
			newAge = ref("newage"),
			dispDatasetBtn = ref("displaydataset"),
			setDataBtn = ref("setdataset");

		function displayDataset(element, index, array) {
			var name = element.textContent;
			outputArea.value += name + ":" + element.dataset.age +
				":" + element.dataset.from + "\n";
		}

		function setDatasset(element) {
			var newDatas = {};

			newDatas.age = newAge.value;

			for (var name in newDatas) {
				element.dataset[name] = newDatas[name];
			}
		}

		function outputDataset() {
			outputArea.value = "";

			/* Arrayオブジェクトのメソッドは利用不可 */
			//customDatas.forEach(displayData);
			for (var i = 0, max = customDatas.length; i < max; i++) {
				displayDataset(customDatas[i], i, customDatas);
			}
		}

		function updateDataset() {
			for (var i = 0, max = customDatas.length; i < max; i++) {
				setDatasset(customDatas[i]);
			}
		}

		this.init = function() {
			dispDatasetBtn.addEventListener("click", outputDataset, false);
			setDataBtn.addEventListener("click", updateDataset, false);
		};
	}

	function Hidden() {
		var hiddenArea = ref("hiddenarea"),
			hiddenChanger = ref("hiddenstylechanger"),
			newDisplayStyle = "flex",
			/**
			 * Chrome35においてhidden属性が指定された要素の
			 * displayプロパティはnoneになっている。
			 */
			orgDispStyle = hiddenArea.style.display;

		function changeStyle() {
			if(hiddenArea.style.display === newDisplayStyle){
				hiddenArea.style.display = orgDispStyle;
			}else{
				hiddenArea.style.display = newDisplayStyle;	
			}
		}

		this.init = function() {
			hiddenChanger.addEventListener("click", changeStyle, false);
		};
	}

	var myModules = {
		progress: Progress,
		dataset: Dataset,
		hidden : Hidden
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
