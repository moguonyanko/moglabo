(function(win, doc, m) {
	"use strict";

	var coordinatesContainers = {
		"c0" : m.ref("CoordinatesParentContainer"),
		"c0-0" : m.ref("CoordinatesChildContainer")
	},
	coordinatesContainerTexts = {
		"c0" : m.ref("CoordinatesParentContainerText"),
		"c0-0" : m.ref("CoordinatesChildContainerText")
	};

	function displayCoordinatesResults(coords) {
		m.ref("CoordinatesResultX").value = Math.round(coords.x);
		m.ref("CoordinatesResultY").value = Math.round(coords.y);
	}

	function getScrollOffsets(opt_win) {
		var w = opt_win || win;

		return {
			x : w.pageXOffset,
			y : w.pageYOffset
		};
	}
	
	function getContainerId(){
		var ContainerTypeEles = m.refs("ContainerType");

		for (var i = 0, len = ContainerTypeEles.length; i < len; i++) {
			var typeEle = ContainerTypeEles[i];
			if (typeEle.checked) {
				return typeEle.value;
			}
		}
		
		return null;
	}

	function getTargetContainer() {
		var containerId = getContainerId();
		return coordinatesContainers[containerId];
	}

	function getTargetContainerText() {
		var containerId = getContainerId();
		return coordinatesContainerTexts[containerId];
	}

	function getContainerCoordinates(box, coordinateType) {
		var coordinates = {};
		coordinates.x = box.left;
		coordinates.y = box.top;

		/**
		 * ビューポート座標にスクロールバーの座標を加算して
		 * ドキュメント座標に変換する。
		 */
		if (coordinateType === "document") {
			var offsets = getScrollOffsets();
			coordinates.x += offsets.x;
			coordinates.y += offsets.y;
		}

		return coordinates;
	}

	function getCoordinatesType() {
		var coordinatesTypeEles = m.refs("CoordinatesType");
		for (var i = 0, len = coordinatesTypeEles.length; i < len; i++) {
			if (coordinatesTypeEles[i].checked) {
				return coordinatesTypeEles[i].value;
			}
		}

		return "";
	}

	function displayContainerCoordinates(evt) {
		/**
		 * getBoundingClientRectの戻り値のプロパティは
		 * 整数ではなく浮動小数点数になることもある。
		 */
		var container = getTargetContainer(),
			box = container.getBoundingClientRect(),
			type = getCoordinatesType();
		var coords = getContainerCoordinates(box, type);
		displayCoordinatesResults(coords);
	}

	function displayContainerTextCoordinates(evt) {
		var text = getTargetContainerText(),
			/**
			 * インライン要素が2行に渡っていた場合，getClientRectsメソッドは
			 * 各行のDOMRectオブジェクトを配列に含めて返す。
			 */
			rects = text.getClientRects();
		
		m.log("座標取得対象のインライン要素は" + rects.length + "行で表示されています。");
		
		var box = rects[0],
			type = getCoordinatesType();
		var coords = getContainerCoordinates(box, type);
		displayCoordinatesResults(coords);
	}

	(function() {
		m.addListener(m.ref("ContainerCoordinatesGetter"), "click", displayContainerCoordinates, false);
		m.addListener(m.ref("ContainerTextCoordinatesGetter"), "click", displayContainerTextCoordinates, false);
	}());

}(window, document, my));
