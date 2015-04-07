(function(win, doc, m) {
	"use strict";

	var coordinateContainers = {
		"c0" : m.ref("CoordinatesParentContainer"),
		"c0-0" : m.ref("CoordinatesChildContainer")
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

	function getTargetContainer() {
		var ContainertypeEles = m.refs("ContainerType"),
			container = null;

		for (var i = 0, len = ContainertypeEles.length; i < len; i++) {
			var typeEle = ContainertypeEles[i];
			if (typeEle.checked) {
				container = coordinateContainers[typeEle.value];
				break;
			}
		}

		return container;
	}

	function getContainerCoordinates(coordinateType) {
		var container = getTargetContainer(),
			coordinates = {};

		if (container) {
			/**
			 * getBoundingClientRectの戻り値のプロパティは
			 * 整数ではなく浮動小数点数になることもある。
			 */
			var box = container.getBoundingClientRect();

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
		var coords = getContainerCoordinates(getCoordinatesType());
		displayCoordinatesResults(coords);
	}

	(function() {
		m.addListener(m.ref("ContainerCoordinatesGetter"), "click", displayContainerCoordinates, false);
	}());

}(window, document, my));
