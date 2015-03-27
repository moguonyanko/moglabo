(function(win, doc, m) {
	"use strict";

	var area = m.ref("SampleNodeInfomationArea"),
		sampleRoot = m.ref("SampleElementNodeContainer");

	var NODETYPECONST = {
		1 : "ELEMENT_NODE",
		3 : "TEXT_NODE",
		7 : "PROCESSING_INSTRUCTION_NODE",
		8 : "COMMENT_NODE",
		9 : "DOCUMENT_NODE",
		10 : "DOCUMENT_TYPE_NODE",
		11 : "DOCUMENT_FRAGMENT_NODE"
	};

	function pp(txt) {
		m.log(txt);
		m.println(area, txt);
	}

	function outputNodeInfomation(node) {
		if (!node) {
			return;
		}

		pp("**********************************");
		pp("ID:" + node.id);
		pp("nodeName:" + node.nodeName);
		pp("nodeType:" + node.nodeType + ", This is " + NODETYPECONST[node.nodeType]);
		pp("nodeValue:" + node.nodeValue);
		pp("data:" + node.data);
		/**
		 * 親ノードがElementまたはDocumentの場合，その子ノードの
		 * 全てのtextContentを返してくる。特定の要素のtextContentのみを
		 * 取得したいならばfirstChild.nodeValueから得るほうが安全か。
		 * ただし外部のライブラリにfirstChildを変更されていないことが前提である。
		 */
		pp("textContent:" + node.textContent);
		/* textから値が得られる時は同じ値がtextContentからも得られる。 */
		pp("text:" + node.text);

		if (node.hasChildNodes()) {
			for (var i = 0, len = node.childNodes.length; i < len; i++) {
				outputNodeInfomation(node.childNodes[i]);
			}
		}
	}

	function outputContainerNodeInfomation() {
		var sampleFragment = doc.createDocumentFragment();

		var sampleScript = doc.createElement("script");
		sampleScript.setAttribute("id", "SampleScriptNode");
		sampleScript.setAttribute("src", "dummy.js");
		outputNodeInfomation(sampleScript);

		/**
		 * DocumentFragmentにappendChildしてもDocumentFragmentの
		 * textContentやnodeValueに何か設定されるわけではない。
		 */
		sampleFragment.appendChild(sampleScript);
		outputNodeInfomation(sampleFragment);

		sampleRoot.appendChild(sampleFragment);
		outputNodeInfomation(sampleRoot);
		sampleRoot.removeChild(sampleScript);
	}

	(function init() {
		m.addListener(m.ref("NodeOutputExecuter"), "click", outputContainerNodeInfomation);

		m.addListener(m.ref("ClearNodeInfomation"), "click", function() {
			area.value = "";
		});

		m.export("nodetest", {
		});
	}());

}(window, document, my));
