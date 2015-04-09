(function(win, doc, m) {
	"use strict";

	var dragContainer = m.ref("draggable-container"),
		dropContainer = m.ref("drop-target-container");
		
	/**
	 * reference:
	 * https://developer.mozilla.org/ja/docs/DragDrop/Drag_Operations
	 */
	function getDragImage(){
		var dragImage = doc.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
		dragImage.width = 50;
		dragImage.height = 50;

		var imgContext = dragImage.getContext("2d");
		imgContext.lineWidth = 4;
		imgContext.moveTo(0, 0);
		imgContext.lineTo(50, 50);
		imgContext.moveTo(0, 50);
		imgContext.lineTo(50, 0);
		imgContext.stroke();
		
		return dragImage;
	}

	function setDragWithCustomImage(dataTransfer){
		var img = getDragImage(),
			xOffset = 25,
			yOffset = 25;

		/**
		 * DataTransfer.setDragImageの第1引数にはImage以外に
		 * Canvasも指定することができる。
		 */
		dataTransfer.setDragImage(img, xOffset, yOffset);
	}

	function dragStart(evt) {
		var dt = evt.dataTransfer;
		dt.setData("text/plain", evt.target.id);
		setDragWithCustomImage(dt);
		
		m.log("DataTransfer.dropEffect=" + dt.dropEffect);
		/**
		 * effectAllowedを指定しなくてもドラッグアンドドロップできる。
		 * noneを設定するとドラッグアンドドロップできなくなる。
		 */
		dt.effectAllowed = "copyMove";
	}

	function dragOver(evt) {
		evt.preventDefault();
	}

	function dragEnd(evt) {
		var dt = evt.dataTransfer;
		if (dt.dropEffect === "move") {
			var target = evt.target,
				txt = "<p>ドラッグされました</p>";
			m.print(target, txt, true);
		}
	}

	function drop(evt) {
		var dt = evt.dataTransfer;
		var targetId = dt.getData("text/plain");

		if (targetId) {
			var draggedEle = m.ref(targetId);
			/**
			 * ドラッグされた要素はDataTransfer.effectAllowedが
			 * copyであっても元の要素から自動的に削除される。
			 */
			evt.target.appendChild(draggedEle);
		}
		
		/**
		 * preventDefaultしないとブラウザがドラッグされた要素の
		 * テキストをURLと解釈してページ遷移しようとする。
		 */
		evt.preventDefault();
	}

	(function() {
		m.addListener(dragContainer, "dragstart", dragStart, false);
		m.addListener(dragContainer, "dragover", dragOver, false);
		m.addListener(dragContainer, "dragend", dragEnd, false);
		m.addListener(dropContainer, "drop", drop, false);
		m.addListener(dropContainer, "dragover", dragOver, false);
	}());

}(window, document, my));
