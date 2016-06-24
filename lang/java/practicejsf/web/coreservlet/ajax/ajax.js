((pj => {
	"use strict";
	
	const coreservlet = pj.includeScripts("jp.ne.practicejsf.coreservlet");
	
	const util = pj.util;
	
	const clearExistingText = id => {
		util.refelt(id).innerHTML = "";
	};
	
	const showElement = id => {
		util.refelt(id).classList.add("visible");
		util.refelt(id).classList.remove("invisible");
	};
	
	const hideElement = id => {
		util.refelt(id).classList.add("invisible");
		util.refelt(id).classList.remove("visible");
	};
	
	const showIndicationRegion = (data, spinnerRegionId, messageRegionId) => {
		const status = data.status;
		
		if (status === "begin") {
			clearExistingText(messageRegionId);
			showElement(spinnerRegionId);
		} else if (status === "complete") {
			hideElement(spinnerRegionId);
		}
	};
	
	coreservlet.ajax = {
		showWorkingIndicator: data => {
			/**
			 * dataのresponseTextにはXML形式のレスポンスが含まれる。
			 */
			util.log(data);
			showIndicationRegion(data, "workingIndicator", "ajaxBank:ajaxMessage2");
		}
	};
})(window.jp.ne.practicejsf));
