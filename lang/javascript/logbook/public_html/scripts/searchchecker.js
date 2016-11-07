((win, doc, lb) => {
	"use strict";
	
	let searchItems,
		searchItemTypes,
		searchAreas;
	
	const getSearchItemScaleFactor = type => {
		const typeData = searchItemTypes.get(type);
		
		if (typeData) {
			return typeData.scalefactor;
		} else {
			return 0;
		}
	};
	
	const getSearchItemImprovementScore = type => {
		const typeData = searchItemTypes.get(type);
		
		if (typeData) {
			return typeData.improvement;
		} else {
			return 0;
		}
	};
	
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
			this.improvement = improvement;
		}
		
		get searchScore() {
			const p1 = getSearchItemScaleFactor(this.type);
			const p2 = this.value + getSearchItemImprovementScore(this.type);
			
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
		
		const p4 = 0.4 * level;
		
		const p5 = 2 * (6 - ships.length);
		
		const result = p1 * p2 + p3 - p4 + p5;
		
		return result;
	};
	
	const getConfig = async name => {
		const url = "/logbook/config/" + name;
		const json = await lb.fetch(url);
		
		if(!json){
			throw new Error(`設定ファイル読み込み失敗: ${url}`);
		}
		
		return json;
	};
	
	/**
	 * 副作用のある非同期関数も記述することができる。ただし呼び出し側の関数宣言と
	 * この関数の呼び出し部分にasync/awaitが指定されていなければ，
	 * 副作用の結果を関数の呼び出し側で参照することができない。
	 */
	const setupSearchConfig = async () => {
		const items = await getConfig("searchitem.json");
		searchItems = lb.objToMap(items);
		
		const types = await getConfig("searchitemtype.json");
		searchItemTypes = lb.objToMap(types);
		
		const areas = await getConfig("searcharea.json");
		searchAreas = lb.objToMap(areas, 
			(areaName, areaInfo) => new SearchArea(areaName, areaInfo));
	};
	
	const testCalc = () => {
		const point = new SearchPoint({
			name: "TEST",
			junction: 1,
			border: 33
		});
		
		const zerokan = new SearchItem({
			name : "zerokan",
			type : "WS",
			value : 6,
			improvement: 3
		});
		
		const dentan = new SearchItem({
			name : "33gou",
			type : "ED",
			value : 7,
			improvement: 0
		});
		
		const zerokans = Array(4).fill(zerokan);
		
		const dentans = Array(2).fill(dentan);
		
		const searchItems = [
			...zerokans, ...dentans
		];
		
		const ships = [
			new Ship(40), 
			new Ship(40), 
			new Ship(45), 
			new Ship(45), 
			new Ship(70), 
			new Ship(75)
		];
		
		const level = 118;
		
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
	
	const appendSearchItems = () => {
		/**
		 * @todo
		 * implement
		 */
	};
	
	const main = async () => {
		await setupSearchConfig();
		
		lb.select(".calc-runner").addEventListener("click", () => {
			const testResult = testCalc();
			const resultArea = lb.select(".result-area");
			resultArea.innerHTML = testResult;
		});
	};
	
	win.addEventListener("DOMContentLoaded", main);
	
})(window, document, window.lB);
