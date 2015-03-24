(function(win, m) {
	"use strict";
	
	function getWeightFilter(border){
		
		return function weightFilter(name, value){
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
	
	var filters = {
		parse : {
			weight : getWeightFilter
		},
		stringify : {
			
		}
	};

	function getSampleJSON() {
		var container = m.ref("SampleJSONObject");
		m.log(container);
		return JSON.parse(container.text);
	}

	function output(o) {
		var area = m.ref("JSONResultArea");
		m.println(area, o);
	}

	(function init() {
		m.addListener(m.ref("DisplayParsedJSON"), "click", function() {
			var json = getSampleJSON();
			m.log(json);
			output(json);
		});

		m.export("jsonNS", {});
	}());

}(window, my));