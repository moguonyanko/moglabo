(function(win, doc, m) {
	"use strict";

	var dragContainer = m.ref("draggable-container"),
		dropContainer = m.ref("drop-target-container");

	function dragStart(evt){
		var dt = evt.dataTransfer;
		dt.setData("text/plain", evt.target.id);
		dt.effectAllowed = "copyMove";
	}
	
	function dragOver(evt){
		evt.preventDefault();
	}
	
	function dragEnd(evt){
		var dt = evt.dataTransfer;
		if(dt.dropEffect === "move"){
			var target = evt.target,
				txt = "<p>ドラッグされました</p>";
			m.print(target, txt, true);
		}
	}
	
	function drop(evt){
		var dt = evt.dataTransfer;
		var targetId = dt.getData("text/plain");
		var draggedEle = m.ref(targetId);
		/**
		 * ドラッグされた要素はDataTransfer.effectAllowedが
		 * copyであっても元の要素から自動的に削除される。
		 */
		evt.target.appendChild(draggedEle);
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
