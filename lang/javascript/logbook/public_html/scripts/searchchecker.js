((win, doc, lb) => {
	"use strict";
	
	let searchItemConfig,
		searchItemTypeConfig,
		searchAreaConfig;
	
	class SearchItem {
		constructor({
			name, 
			type, 
			value, 
			improvement = 0
			} = {}) {
			this.name = name;
			this.type = type;
			this.value = value;
			this.improvement = parseInt(improvement);
		}
		
		get searchScore() {
			const typeData = searchItemTypeConfig.get(this.type);
			
			let factor = typeData ? typeData.scalefactor : 0;
			let reinforced = typeData ? typeData.reinforcement : 0;
			
			const p1 = factor;
			const p2 = this.value + reinforced * Math.sqrt(this.improvement);
			
			return p1 * p2;
		}
	}
	
	const createSearchItem = (config, opt_impValue = 0) => {
		const item = new SearchItem({
			name: config.name,
			type: config.type,
			value: config.value,
			improvement: opt_impValue
		});
		return item;
	};
	
	class Ship {
		constructor(value) {
			this.value = value;
		}
		
		get searchScore() {
			return Math.sqrt(this.value);
		}
	}
	
	class SearchPoint {
		constructor(parentAreaName, {name, junction = 1, border} = {}) {
			this.parentAreaName = parentAreaName;
			this.name = name;
			this.junction = junction;
			this.border = border;
		}
		
		toString() {
			return `${this.parentAreaName}-${this.name}`;
		}
		
		toJSON() {
			const obj = {};
			obj.name = this.name;
			obj.junction = this.junction;
			obj.border = this.border;
			return JSON.stringify(obj);
		}
	}
	
	class SearchArea {
		constructor(areaName, infos) {
			this.areaName = areaName;
			this.points = lb.arrayToMap(infos, 
				info => info.name, 
				info => new SearchPoint(areaName, info));
		}
		
		getPoint(pointName) {
			return this.points.get(pointName);
		}
	}
	
	/**
	 * @param args {Object} 計算パラメータ群
	 * junction 分岐点係数 デフォルト1
	 * members 出撃艦数 デフォルト6
	 * searchitems 索敵装備群
	 * ships 出撃艦群
	 * level 司令部レベル
	 * 
	 * @description
	 * 計算式:
	 * 分岐点係数*SUM(装備倍率*装備索敵値)+SUM(√各艦素索敵)-(0.4*司令部レベル※)+
	 * 2*(6-出撃艦数)
	 * 
	 * ※端数は切り上げ
	 */
	const calc = ({ 
		junction = 1,
		searchItems = [],
		ships = [],
		level
		} = {}) => {
		const p1 = junction;	
			
		const p2 = searchItems
			.map(item => item.searchScore)
			.reduce((v1, v2) => v1 + v2, 0);
		
		const p3 = ships
			.map(ship => ship.searchScore)
			.reduce((v1, v2) => v1 + v2);
		
		const p4 = Math.ceil(0.4 * level);
		
		const p5 = 2 * (6 - ships.length);
		
		const result = p1 * p2 + p3 - p4 + p5;
		
		return result;
	};
	
	/**
	 * 副作用のある非同期関数も記述することができる。ただし呼び出し側の関数宣言と
	 * この関数の呼び出し部分にasync/awaitが指定されていなければ，
	 * 副作用の結果を関数の呼び出し側で参照することができない。
	 */
	const loadSearchConfig = async () => {
		const loadItems = async () => {
			const items = await lb.getConfig("searchitem.json");
            const result = Object.entries(items).sort((itemA, itemB) => {
                return itemA[1].name <= itemB[1].name ? -1 : 1;
            });
            // Object.entriesの結果をそのままMapコンストラクタに渡して
            // Mapオブジェクトを得ることができる。
			const searchItems = new Map(result);
			return searchItems;
		};
		
		const loadItemTypes = async () => {
			const types = await lb.getConfig("searchitemtype.json");
			const searchItemTypes = lb.objToMap(types);
			return searchItemTypes;
		};
		
		const loadAreas = async () => {
			const areas = await lb.getConfig("searcharea.json");
			const searchAreas = lb.objToMap(areas, 
				(areaName, areaInfo) => new SearchArea(areaName, areaInfo));
			return searchAreas;
		};
			
		const funcs = [ loadItems, loadItemTypes, loadAreas ];
		
		/**
		 * Prmoise.allに当たる処理をawait*と書くことはできない。
		 * ECMAScriptの仕様から削除されたようである。
		 * https://github.com/rwaldron/tc39-notes/blob/aad8937063ab32eb33ec2a5b40325b1d9f171180/es6/2014-04/apr-10.md#preview-of-asnycawait
		 */
		const [ searchItems, searchItemTypes, searchAreas ] = 
			await Promise.all(funcs.map(f => f()));
		
		return { searchItems, searchItemTypes, searchAreas };
	};
	
	const testCalc = () => {
		const point = new SearchPoint({
			name: "TEST",
			junction: 1,
			border: 33
		});
		
		const ro43Plus6 = new SearchItem({
			name : "ro.43",
			type : "水上偵察機",
			value : 4,
			improvement: 6
		});
		
		const yatei = new SearchItem({
			name : "yatei",
			type : "水上偵察機",
			value : 3,
			improvement: 0
		});
		
		const zerokan = new SearchItem({
			name : "zerokan",
			type : "水上偵察機",
			value : 6,
			improvement: 0
		});
		
		const zerokanPlus3 = new SearchItem({
			name : "zerokan",
			type : "水上偵察機",
			value : 6,
			improvement: 3
		});
		
		const dt33 = new SearchItem({
			name : "33gou",
			type : "小型電探",
			value : 7,
			improvement: 0
		});
		
		const dt22k4 = new SearchItem({
			name : "22goukai4",
			type : "小型電探",
			value : 5,
			improvement: 0
		});
		
		const dt32k = new SearchItem({
			name : "32goukai",
			type : "大型電探",
			value : 11,
			improvement: 0
		});
		
		const dt32 = new SearchItem({
			name : "32gou",
			type : "大型電探",
			value : 10,
			improvement: 0
		});
		
		const wss = [ 
			ro43Plus6, ro43Plus6, zerokanPlus3
		];
		
		const dts = [ dt33, dt32k, dt32 ];
		
		const sl = new SearchItem({
			name : "searchlight",
			type : "探照灯",
			value : 2,
			improvement: 0
		});
		
		const searchItems = [ ...wss, ...dts, sl ];
		
		const ships = [
			new Ship(26), 
			new Ship(26), 
			new Ship(30), 
			new Ship(33), 
			new Ship(49), 
			new Ship(68)
		];
		
		const level = 120;
		
		const testArgs = {
			junction: point.junction,
			searchItems,
			ships,
			level
		};
		
		return calc(testArgs);
	};
	
	/**
	 * DOMからパラメータを取得する関数群
	 */
	
	const appendSearchItems = searchItems => {
		const maxSlotSize = 4,
			maxShipSize = 6;
			
		const eleSize = maxSlotSize * maxShipSize;
		
		for(let i = 0; i < eleSize; i++){
			const container = doc.createElement("div");
			container.setAttribute("class", "search-item-element");
			const sel = doc.createElement("select");
			const emptyOpt = doc.createElement("option");
			emptyOpt.selected = "selected";
			sel.appendChild(emptyOpt);
			Array.from(searchItems.keys()).forEach(key => {
				const opt = doc.createElement("option");
				opt.value = key;
				opt.appendChild(doc.createTextNode(searchItems.get(key).name));
				sel.appendChild(opt);
			});
			container.appendChild(sel);
			const impInfoEle = doc.createElement("span");
			const imp = doc.createElement("input");
			imp.type = "range";
			imp.value = 0;
			imp.min = 0;
			imp.max = 10;
			imp.addEventListener("change", () => {
				const val = parseInt(imp.value);
				if (imp.min < val && val < imp.max) {
					impInfoEle.innerHTML = "★" + val;
				} else if (val <= imp.min) {
					impInfoEle.innerHTML = "";
				} else {
					impInfoEle.innerHTML = "★max";
				}
			});
			sel.addEventListener("change", () => {
				impInfoEle.innerHTML = "";
				imp.value = 0;
			});
			container.appendChild(imp);
			container.appendChild(impInfoEle);
			lb.select(".search-item-section").appendChild(container);
		}
	};
	
	const getSearchItems = () => {
		const allItems = lb.selectAll(".search-item-element");
		const selectedSearchItems = [];
		Array.from(allItems).forEach(itemEle => {
			const sel = lb.select("select", itemEle);
			if(searchItemConfig.has(sel.value)){
				const config = searchItemConfig.get(sel.value);
				const impRange = lb.select("input[type='range']", itemEle);
				const searchItem = createSearchItem(config, impRange.value);
				selectedSearchItems.push(searchItem);
			}
		});
		
		return selectedSearchItems;
	};
	
	const getPointAppender = searchArea => {
		const appender = () => {
			const searchPointList = lb.select(".search-point-list");
			searchPointList.options.length = 0;
			searchArea.points.forEach((searchPoint, pointName) => {
				const opt = doc.createElement("option");
				opt.value = pointName;
				opt.appendChild(doc.createTextNode(pointName));
				searchPointList.appendChild(opt);
			});
		};

		return appender;
	};
	
	const appendSearchAreas = searchAreas => {
		const container = lb.select(".search-area-container");
		Array.from(searchAreas.entries()).forEach((entry, idx) => {
			const areaName = entry[0];
			const searchArea = entry[1];
			const p = doc.createElement("div");
			const label = doc.createElement("label");
			const areaInput = doc.createElement("input");
			areaInput.type = "radio";
			areaInput.value = areaName;
			areaInput.name = "searcharea";
			const appender = getPointAppender(searchArea);
			areaInput.addEventListener("click", () => {
				if(areaInput.checked){
					appender();
				}
			});
			
			if (idx === 0) {
				areaInput.checked = "checked";
				appender();
			}
			
			label.appendChild(areaInput);
			label.appendChild(doc.createTextNode(areaName));
			p.appendChild(label);
			container.appendChild(p);
		});
	};
	
	const getSearchAreaName = () => {
		const areaContainer = lb.select(".search-area-container");
		const checkedAreaEle = lb.select("input[type='radio']:checked", areaContainer);
		if (checkedAreaEle) {
			return checkedAreaEle.value;
		} else {
			return "";
		}
	};
	
	const getShips = () => {
		const shipEles = lb.selectAll(".ship");
		const ships = Array.from(shipEles).map(ele => {
			const input = lb.select("input[type='number']", ele);
			return new Ship(parseInt(input.value));
		});
		return ships;
	};
	
	const printCheckResult = () => {
		const searAreaName = getSearchAreaName();
		const searchArea = searchAreaConfig.get(searAreaName);
		const searchPointName = lb.select(".search-point-list").value;
		const searchPoint = searchArea.getPoint(searchPointName);
		const junction = searchPoint.junction;

		const searchItems = getSearchItems();
		
		const ships = getShips();
		
		const levelEle = lb.select(".level-section input[type='number']");
		const level = levelEle.value;

		const args = {
			junction,
			searchItems,
			ships,
			level
		};

		const result = calc(args);
		const resultArea = lb.select(".result-area");
		resultArea.innerHTML = result;
	};
	
	const main = async () => {
		const { searchItems, searchItemTypes, searchAreas } = await loadSearchConfig();
		
		searchItemConfig = searchItems;
		searchItemTypeConfig = searchItemTypes;
		searchAreaConfig = searchAreas;
		
		appendSearchItems(searchItems);
		appendSearchAreas(searchAreas);
		
		lb.select(".calc-runner").addEventListener("click", printCheckResult);
        
        console.log(`test value=${testCalc()}`);
	};
	
	win.addEventListener("DOMContentLoaded", main);
	
})(window, document, window.lB);
