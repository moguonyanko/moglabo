(function(win, m) {
	"use strict";
	
	function getWeightFilter(border){
		
		return function(name, value){
			if(name === "weight"){
				if(value >= border){
					return value;
				}else{
					return undefined;
				}
			}else{
				/* weight以外のプロパティは削除する。 */
				return undefined;
			}
		};
	}
	
	function defaultFilter(name, value){
		return value;
	}
	
	var filterFactories = {
		weight : getWeightFilter
	};
	
	function getFilter(){
		var eles = m.refs("JSONFilters"),
			borderEle = m.ref("JSONBorderValue");
		
		var ele;
		for(var i = 0, len = eles.length; i < len; i++){
			if(eles[i].checked){
				ele = eles[i];
				break;
			}
		}
		
		if(ele && typeof filterFactories[ele.value] === "function"){
			return filterFactories[ele.value](borderEle.value);
		}else{
			return defaultFilter;
		}
	}

	function getSampleJSON() {
		var container = m.ref("SampleJSONObject"),
			/**
			 * pre要素内の文字列はTextNodeのnodeValueとして
			 * 保存されている。
			 */
			jsonText = container.firstChild.nodeValue;
		
		var filter = getFilter();
		
		return JSON.parse(jsonText, filter);
	}

	function output(o) {
		var area = m.ref("JSONResultArea");
		m.println(area, o, true);
	}

	(function init() {
		m.addListener(m.ref("DisplayParsedJSON"), "click", function() {
			var json = getSampleJSON();
			
			m.log(json);
			
			var indent = 4;
			var strJson = JSON.stringify(json, null, indent);
			output(strJson);
		});

		m.export("jsonNS", {});
	}());

}(window, my));