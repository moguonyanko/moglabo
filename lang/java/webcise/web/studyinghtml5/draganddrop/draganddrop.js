(function(win, doc, m) {
	"use strict";

	var dragContainer = m.ref("draggable-container"),
		dropContainer = m.ref("drop-target-container");

	var dragSampleImage = new Image();
	dragSampleImage.src = "../../favicon.ico";

	/**
	 * reference:
	 * https://developer.mozilla.org/ja/docs/DragDrop/Drag_Operations
	 */
	var dragSampleCanvas = (function() {
		var dragCanvas = doc.createElement("canvas");
		dragCanvas.width = 50;
		dragCanvas.height = 50;

		var imgContext = dragCanvas.getContext("2d");
		imgContext.lineWidth = 4;
		imgContext.moveTo(0, 0);
		imgContext.lineTo(50, 50);
		imgContext.moveTo(0, 50);
		imgContext.lineTo(50, 0);
		imgContext.stroke();

		/**
		 * DataTransfer.setDragImageはImageDataを受け取るとエラーを返す。
		 */
		//return imgContext.getImageData(0, 0, dragCanvas.width, dragCanvas.height);
		return dragCanvas;
	}());

	var dragImages = {
		image : dragSampleImage,
		canvas : dragSampleCanvas
	};

	function getSelectedDragImageType() {
		var types = m.refs("drag-image-type");

		for (var i = 0, len = types.length; i < len; i++) {
			if (types[i].checked) {
				return types[i].value;
			}
		}

		/**
		 * デフォルトはブラウザサポート状況の良い
		 * Imageオブジェクトを選択したことにする。 
		 */
		return "image";
	}

	function getDragImage() {
		var dragImageType = getSelectedDragImageType();
		return dragImages[dragImageType];
	}

	function setDragWithCustomImage(dataTransfer) {
		var dragImage = getDragImage(),
			xOffset = 25,
			yOffset = 25;

		/**
		 * Firefox37ではDataTransfer.setDragImageの第1引数にはImage以外に
		 * Canvasも指定することができる。
		 * Chrome41の場合，Canvasを渡した時は無視される。
		 * Firefox37でもChrome41でもsetDragImageにImageDataを渡すとエラーになる。
		 * 
		 * 複数の画像をドラッグ画像として同時に表示することはできない。
		 * 後からsetDragImageされた画像が用いられる。
		 */
		dataTransfer.setDragImage(dragImage, xOffset, yOffset);
	}

	function dragStart(evt) {
		var dt = evt.dataTransfer;

		var draggableElementId = evt.target.id,
			/**
			 * URLとして不適切な値をsetDataした場合，
			 * Chrome41では「text/uri-list」がDtataTransfer.typesに
			 * 含まれなくなる。Firefox37では含まれる。
			 */
			sampleUrl = "//localhost/webcise/";

		/**
		 * Chrome41ではDataTransfer.typesは空の配列になっている。
		 */
		try {
			dt.setData("text/plain", draggableElementId);
			dt.setData("text/uri-list", sampleUrl);
		} catch (err) {
			/** 
			 * 以下はIE11用 
			 * IE11はMIMEタイプによる指定に未対応でありエラーとなる。
			 */
			dt.setData("text", draggableElementId);
			dt.setData("url", sampleUrl);
		}

		setDragWithCustomImage(dt);

		m.log("DataTransfer.dropEffect ... " + dt.dropEffect);
		/**
		 * effectAllowedを指定しなくてもドラッグアンドドロップできる。
		 * noneを設定するとドラッグアンドドロップできなくなる。
		 */
		dt.effectAllowed = "copyMove";
	}

	function preventDefault(evt) {
		evt.preventDefault();
	}

	function dragEnd(evt) {
		var dt = evt.dataTransfer;
		if (dt.dropEffect === "move") {
			/**
			 * Chrome41ではdragendではDataTransfer.typesは空の配列になっている。
			 * Firefox37ではdropイベント時と同じ値が保存されている。
			 */
			var draggableDataType = getDataTypeString(dt);
			var target = evt.target,
				info = "<p>ドラッグされました。</p>" +
				"<p>dragendイベント内で取得可能なドラッグ型は「" + draggableDataType + "」です。</p>";

			m.print(target, info, true);
		}
	}

	function getDataTypeString(dt) {
		var separator = ",";

		/**
		 * DataTransfer.typesはChrome41では配列だが
		 * Firefox37ではDOMStringListである。
		 */
		if (Array.isArray(dt.types)) {
			return dt.types.join(separator);
		} else {
			return Array.prototype.reduce.call(dt.types, function(t1, t2) {
				if (t1 && t2) {
					return t1 + separator + t2;
				} else {
					return t2;
				}
			}, "");
		}
	}

	function containType(dt, type) {
		if (typeof dt.types.contains === "function") {
			return dt.types.contains(type);
		} else {
			return dt.types.indexOf(type) >= 0;
		}
	}

	function drop(evt) {
		preventDefault(evt);

		var dt = evt.dataTransfer;

		var draggableDataType = getDataTypeString(dt);
		m.log("dropイベント内で取得可能なドラッグ型 ... " + draggableDataType);

		var targetId = containType(dt, "text/plain") ?
			dt.getData("text/plain") : dt.getData("text");

		if (targetId) {
			var draggedEle = m.ref(targetId);
			/**
			 * ドラッグされた要素はDataTransfer.effectAllowedが
			 * copyであっても元の要素から自動的に削除される。
			 */
			evt.target.appendChild(draggedEle);
		}
	}

	(function() {
		m.addListener(dragContainer, "dragstart", dragStart, false);
		m.addListener(dragContainer, "dragover", preventDefault, false);
		m.addListener(dragContainer, "drop", preventDefault, false);
		m.addListener(dragContainer, "dragend", dragEnd, false);
		m.addListener(dropContainer, "drop", drop, false);
		m.addListener(dropContainer, "dragover", preventDefault, false);
		m.addListener(dropContainer, "dragenter", preventDefault, false);
	}());

}(window, document, my));
