((win, doc, lB) => {
	"use strict";

	const pointTypes = {
		normal: "normal",
		sensui_event: "sensui_event",
		kouku: "kouku",
		kushu: "kushu",
		fancy: "fancy"
	};

	const resourceTypes = {
		fuel: "fuel",
		ammo: "ammo"
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

		get fuel() {
			return this.point.fuel;
		}

		get ammo() {
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

			if (!point) {
				throw new Error(`Unsupported type: ${type}`);
			}

			return new Condition(point, night);
		}

		[Symbol.iterator] () {
			return this.config.entries();
		}
	}

	const getResidual = (conditions, resourceType) => {
		let prop;

		if (!(resourceType in resourceTypes)) {
			throw new Error(`Unsupported residual type: ${resourceType}`);
		}

		const usedAmmo = conditions.map(c => c[resourceType]).reduce((am1, am2) => am1 + am2);

		return 100 - usedAmmo;
	};

	const calcRevision = (factory, params, resourceType) => {
		const conditions = params.map(param => factory.create(...param));
		const residual = getResidual(conditions, resourceType);
		const revision = getRevision(residual);

		return revision;
	};

	const testCalcRevision = async () => {
		const params = [
			[pointTypes.kushu, false],
			[pointTypes.normal, false],
			[pointTypes.normal, true],
			[pointTypes.normal, false],
			[pointTypes.kushu, false]
		];

		const conf = await loadPointConfig();
		const factory = new ConditionFactory(conf);
		const revision = calcRevision(factory, params, resourceTypes.ammo);

		console.log("TEST:弾薬量補正=" + revision);
	};

	/**
	 * 状態選択用ページの構築
	 * 
	 * DOMを扱うコードとECMAScriptで完結できるコードは分離する。
	 */

	const getPointConditionParams = () => {
		const pointEles = doc.querySelectorAll(".point-selector");

		const params = Array.from(pointEles).map(pointEle => {
			const typeEles = pointEle.querySelectorAll(".type-selector");
			const checkedTypes = Array.from(typeEles)
					.filter(typeEle => typeEle.checked);
			const type = checkedTypes[0].value;

			const nightEle = pointEle.querySelector(".check-night");
			const night = nightEle.checked;

			return [type, night];
		});

		return params;
	};

	const getPointContainers = (id, factory) => {
		const containers = Array.from(factory).map(kv => {
			const [key, point] = kv;

			const label = doc.createElement("label");
			label.setAttribute("class", "type-selector-name");
			const input = doc.createElement("input");
			input.setAttribute("type", "radio");
			input.setAttribute("name", "point-" + id);
			input.setAttribute("class", "type-selector");
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

	const getNightChecker = () => {
		const chkLabel = doc.createElement("label");
		chkLabel.setAttribute("class", "check-night-name");
		const chkNight = doc.createElement("input");
		chkNight.setAttribute("type", "checkbox");
		chkNight.setAttribute("class", "check-night");
		chkLabel.appendChild(chkNight);
		chkLabel.appendChild(doc.createTextNode("夜戦"));

		return chkLabel;
	};

	const initPointSelectors = (factory, selSize) => {
		const baseContainer = doc.querySelector(".point-type-container");
		baseContainer.innerHTML = "";

		const frag = doc.createDocumentFragment();

		for (let i = 0; i < selSize; i++) {
			const containers = getPointContainers(i, factory);
			const base = doc.createElement("li");
			base.setAttribute("class", "point-selector");
			containers.forEach(container => base.appendChild(container));
			base.appendChild(getNightChecker());
			frag.appendChild(base);
		}

		baseContainer.appendChild(frag);
	};

	const getCount = () => {
		const e = doc.querySelector(".count");
		return parseInt(e.value);
	};

	let viewResultRevision = () => {
		//Does nothing by default
	};

	/**
	 * viewResultRevisionとinitPointSelectorsで参照されるpointconfigは同一でなければ
	 * ページ初期化時と補正値計算時で矛盾が生じる可能性がある。確実に同一のpointconfigが参照
	 * されるようにinitPage内でviewResultRevisionを定義している。
	 */
	const initPage = async () => {
		const conf = await loadPointConfig();
		const factory = new ConditionFactory(conf);

		viewResultRevision = (target, resourceType) => {
			const params = getPointConditionParams();
			const revision = calcRevision(factory, params, resourceType);
			target.innerHTML = revision * 100;
		};

		initPointSelectors(factory, getCount());

		const resultEles = doc.querySelectorAll(".result-value");
		Array.from(resultEles).forEach(ele => ele.innerHTML = "");
	};

	const addListeners = () => {
		const initEle = doc.querySelector(".init-conatiners");
		initEle.addEventListener("click", async () => await initPage());

		const fuelRunner = doc.querySelector(".run-calc-fuel");
		fuelRunner.addEventListener("click", () => {
			const target = doc.querySelector(".result-value-fuel");
			viewResultRevision(target, resourceTypes.fuel);
		});

		const ammoRunner = doc.querySelector(".run-calc-ammo");
		ammoRunner.addEventListener("click", () => {
			const target = doc.querySelector(".result-value-ammo");
			viewResultRevision(target, resourceTypes.ammo);
		});
	};

	const init = async () => {
		await initPage();
		addListeners();

		await testCalcRevision();
	};

	win.addEventListener("DOMContentLoaded", init);

})(window, document, window.lB);