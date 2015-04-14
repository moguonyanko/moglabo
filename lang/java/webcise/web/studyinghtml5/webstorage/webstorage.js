(function(win, doc, m) {
	"use strict";

	var resultArea = m.ref("ResultArea"),
		resultClearer = m.ref("result-clearer"),
		evtFrameContainer = m.ref("EventFrameContainer");

	var eventPageUrl = "storagechanger.html",
		eventPageId = "StorageChangerFrame",
		eventPageName = "StorageChanger",
		eventPageWidth = "800px",
		eventPageHeight = "600px";

	function outputLog(txt) {
		m.println(resultArea, txt);
	}
	
	function getSuffix(){
		return "_" + Date.now();
	}

	function createEventFrame() {
		var suf = getSuffix();
		
		var iframe = doc.createElement("iframe");
		iframe.setAttribute("id", eventPageId + suf);
		iframe.setAttribute("src", eventPageUrl);
		iframe.setAttribute("name", eventPageName + suf);
		iframe.setAttribute("width", eventPageWidth);
		iframe.setAttribute("height", eventPageHeight);
		return iframe;
	}

	function addEvent() {
		m.addListener(m.ref("EventWindowOpener"), "click", function() {
			var feature = "width=" + eventPageWidth +
				",height=" + eventPageHeight +
				",status=yes,resizable=yes";
			window.open(eventPageUrl + "?" + getSuffix(), eventPageName + getSuffix(), feature);
		}, false);

		m.addListener(m.ref("EventFrameOpener"), "click", function() {
			var newFrame = createEventFrame();
			evtFrameContainer.appendChild(newFrame);
		}, false);

		m.addListener(resultClearer, "click", function() {
			m.print(resultArea, "", true);
		}, false);

		/**
		 * ストレージを更新したウインドウやタブでstorageイベントは発生しない。
		 * また値が変化しないとstorageイベントは発生しない。
		 * 
		 * Storage.clearでイベントが発生した時はkey, oldValue, newValueはnullになる。
		 * 
		 * sessionStorageの場合はストレージの更新がフレームで行われた時しか発生しない。
		 * つまり別のタブやウインドウでストレージを更新してもlocalStorageでなければ
		 * storageイベントは発生しない。
		 * 
		 * localStorageは複数のタブやウインドウで共有される。
		 * ただし各タブやウインドウの読み込んだページのオリジンが全て同じである
		 * 必要がある。
		 * 
		 * sessionStorageは同じウインドウ内の複数のフレーム間では共有される。
		 * フレームの読み込んだページのオリジンは全て同じである必要がある。
		 */
		m.addListener(win, "storage", function(evt) {
			var log = [
				"key:" + evt.key,
				"old value:" + evt.oldValue,
				"new value:" + evt.newValue,
				"url:" + evt.url
			];

			m.log(evt);

			outputLog(log.join("\n"));
		}, false);
	}

	function init() {
		addEvent();
	}

	init();

}(window, document, my));
