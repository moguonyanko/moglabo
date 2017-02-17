((win, doc, lB) => {
	"use strict";

	const pointTypes = {
		normal: "normal", 
		sensui_event: "sensui_event", 
		kouku: "kouku", 
		kushu: "kushu", 
		fancy: "fancy"
	};

	class Point {
		constructor(typeName, {name, fuel, ammo}) {
			this.typeName = typeName;
			this.name = name;
			this.fuel = fuel;
			this.ammo = ammo;
		}

		isNormal() {
			return this.typeName === pointTypes.normal;
		}
	}

	class Condition {
		constructor(point, night = false) {
			this.point = point;
			this.night = night;
		}
		
		/**
		 * プロパティとして定義すると利用する側からすればシンプルになるが，誤った
		 * プロパティ名で参照してしまった時にundefinedが返されるため間違いを見つけるのに
		 * 時間がかかることがある。メソッドとして定義してあれば存在しないメソッド名を
		 * 参照して呼び出した時点でエラーになるので間違いを発見するのが早くなる。
		 */
		
		get residualFuel() {
			return this.point.fuel;
		}
		
		get residualAmmo() {
			if (this.night) {
				return this.point.ammo * 1.5;
			} else {
				return this.point.ammo;
			}
		}
	}

	const getRevision = residual => {
		if (residual < 0 || 100 <= residual) {
			throw new Error("残量は0%以上100%以下の値を指定して下さい。");
		}

		if (50 <= residual) {
			return 1.0;
		} else {
			return 2 * (residual / 100);
		}
	};

	const loadPointConfig = async () => {
		const req = new Request("../../config/pointconfig.json");
		const res = await fetch(req);
		const datas = await res.json();

		const revisionDatas = new Map();

		for (let typeName in datas) {
			const p = new Point(typeName, datas[typeName]);
			revisionDatas.set(typeName, p);
		}

		return revisionDatas;
	};
	
	class ConditionFactory {
		constructor(config) {
			this.config = config;
		}
		
		create(type, night) {
			const point = this.config.get(type);
			return new Condition(point, night);
		}
	}
	
	const testCalcRevision = async () => {
		const conf = await loadPointConfig();
		
		const factory = new ConditionFactory(conf);
		
		const params = [
			[pointTypes.kushu, false],
			[pointTypes.normal, false],
			[pointTypes.normal, true],
			[pointTypes.normal, false],
			[pointTypes.kushu, false]
		];
		
		const conditions = params.map(param => {
			return factory.create(...param);
		});
		
		const usedAmmo = conditions.map(c => c.residualAmmo)
				.reduce((am1, am2) => am1 + am2);
		
		const residual = 100 - usedAmmo;
		
		const revision = getRevision(residual);
		
		console.log("弾薬量補正=" + revision);
	};

	/**
	 * 状態選択用ページの構築
	 * 
	 * DOMを扱うコードとECMAScriptで完結できるコードは分離する。
	 */

	const getPointContainers = (id, datas) => {
		const containers = Array.from(datas.entries()).map(kv => {
			const [key, point] = kv;
			const label = doc.createElement("label");

			const input = doc.createElement("input");
			input.setAttribute("type", "radio");
			input.setAttribute("name", "point-" + id);
			input.setAttribute("value", key);

			if (point.isNormal()) {
				input.setAttribute("checked", "checked");
			}

			label.appendChild(input);

			label.appendChild(doc.createTextNode(point.name));

			return label;
		});

		return containers;
	};

	const initPointSelectors = (datas, selSize) => {
		const baseContainer = doc.querySelector(".point-type-container");
		baseContainer.innerHTML = "";

		const frag = doc.createDocumentFragment();

		for (let i = 0; i < selSize; i++) {
			const containers = getPointContainers(i, datas);
			const base = doc.createElement("li");
			base.setAttribute("class", "point-selector");
			containers.forEach(container => {
				base.appendChild(container);
			});

			frag.appendChild(base);
		}

		baseContainer.appendChild(frag);
	};

	const getCount = () => {
		const e = doc.querySelector(".count");
		return parseInt(e.value);
	};

	const initAllSelectors = async () => {
		const datas = await loadPointConfig();
		initPointSelectors(datas, getCount());
	}

	const addListeners = () => {
		const initEle = doc.querySelector(".init-conatiners");
		initEle.addEventListener("click", async evt => {
			await initAllSelectors();
		});
	};

	const init = async () => {
		await initAllSelectors();
		addListeners();
		
		await testCalcRevision();
	};

	win.addEventListener("DOMContentLoaded", init);

})(window, document, window.lB);