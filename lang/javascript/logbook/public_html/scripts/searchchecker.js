((win, doc, lb) => {
	"use strict";
	
	let searchItemTypeConfig;
	
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
	
	class Ship {
		constructor(value) {
			this.value = value;
		}
		
		get searchScore() {
			return Math.sqrt(this.value);
		}
	}
	
	class SearchPoint {
		constructor({name, junction = 1, border} = {}) {
			this.name = name;
			this.junction = junction;
			this.border = border;
		}
	}
	
	class SearchArea {
		constructor(areaName, infos) {
			this.areaName = areaName;
			this.points = lb.arrayToMap(infos, 
				info => info.name, 
				info => new SearchPoint(info));
		}
		
		getPoint(pointName) {
			return this.points[pointName];
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
			.reduce((v1, v2) => v1 + v2);
		
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
		const items = await lb.getConfig("searchitem.json");
		const searchItems = lb.objToMap(items);
		
		const types = await lb.getConfig("searchitemtype.json");
		const searchItemTypes = lb.objToMap(types);
		
		const areas = await lb.getConfig("searcharea.json");
		const searchAreas = lb.objToMap(areas, 
			(areaName, areaInfo) => new SearchArea(areaName, areaInfo));
			
		return {
			searchItems, searchItemTypes, searchAreas
		};
	};
	
	const testCalc = () => {
		const point = new SearchPoint({
			name: "TEST",
			junction: 1,
			border: 33
		});
		
		const ro43Plus6 = new SearchItem({
			name : "ro.43",
			type : "WS",
			value : 4,
			improvement: 6
		});
		
		const yatei = new SearchItem({
			name : "yatei",
			type : "WS",
			value : 3,
			improvement: 0
		});
		
		const zerokan = new SearchItem({
			name : "zerokan",
			type : "WS",
			value : 6,
			improvement: 0
		});
		
		const zerokanPlus3 = new SearchItem({
			name : "zerokan",
			type : "WS",
			value : 6,
			improvement: 3
		});
		
		const dt33 = new SearchItem({
			name : "33gou",
			type : "SED",
			value : 7,
			improvement: 0
		});
		
		const dt22k4 = new SearchItem({
			name : "22goukai4",
			type : "SED",
			value : 5,
			improvement: 0
		});
		
		const dt32k = new SearchItem({
			name : "32goukai",
			type : "BED",
			value : 11,
			improvement: 0
		});
		
		const dt32 = new SearchItem({
			name : "32gou",
			type : "BED",
			value : 10,
			improvement: 0
		});
		
		const wss = [ 
			ro43Plus6, ro43Plus6, zerokanPlus3
		];
		
		const dts = [ dt33, dt32k, dt32 ];
		
		const sl = new SearchItem({
			name : "searchlight",
			type : "SL",
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
		
		const level = 119;
		
		const testArgs = {
			junction: point.junction,
			searchItems,
			ships,
			level
		};
		
		return calc(testArgs);
	};
	
	/**
	 * DOMからパラメータを取得するコード
	 */
	
	const getJunctionPoint = () => {
		/**
		 * @todo
		 * implement
		 */
	};
	
	const getShips = () => {
		/**
		 * @todo
		 * implement
		 */
	};
	
	const getImprovement = () => {
		/**
		 * @todo
		 * implement
		 */
	};
	
	const appendSearchItems = searchItems => {
		const maxSlotSize = 4,
			maxShipSize = 6;
			
		const eleSize = maxSlotSize * maxShipSize;
		
		for(let i = 0; i < eleSize; i++){
			const container = doc.createElement("div");
			const sel = doc.createElement("select");
			const emptyOpt = doc.createElement("option");
			emptyOpt.selected = "selected";
			sel.appendChild(emptyOpt);
			searchItems.forEach((v, k) => {
				const opt = doc.createElement("option");
				opt.value = k;
				opt.appendChild(doc.createTextNode(v.name));
				sel.appendChild(opt);
			});
			container.appendChild(sel);
			lb.select(".search-item-section").appendChild(container);
		}
	};
	
	const main = async () => {
		const {searchItems, searchItemTypes, searchAreas} = await loadSearchConfig();
		
		searchItemTypeConfig = searchItemTypes;
		
		appendSearchItems(searchItems);
		
		lb.select(".calc-runner").addEventListener("click", () => {
			const testResult = testCalc();
			const resultArea = lb.select(".result-area");
			resultArea.innerHTML = testResult;
		});
	};
	
	win.addEventListener("DOMContentLoaded", main);
	
})(window, document, window.lB);
