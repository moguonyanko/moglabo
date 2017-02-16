((win, doc, lB) => {
	"use strict";

	class Point {
		constructor(typeName, {name, fuel, ammo}) {
			this.typeName = typeName;
			this.name = name;
			this.fuel = fuel;
			this.ammo = ammo;
		}
		
		isNormal () {
			return this.typeName === "normal";
		}
	}

	const loadData = async () => {
		const req = new Request("../../config/revisiondata.json");
		const res = await fetch(req);
		const datas = await res.json();

		const revisionDatas = new Map();

		for (let typeName in datas) {
			const p = new Point(typeName, datas[typeName]);
			revisionDatas.set(typeName, p);
		}

		return revisionDatas;
	};

	/**
	 * 状態選択用ページの構築
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
			const base = doc.createElement("div");
			base.setAttribute("class", "point-selector");
			containers.forEach(c => {
				base.appendChild(c);
			});

			frag.appendChild(base);
		}

		baseContainer.appendChild(frag);
	};

	const init = async () => {
		const datas = await loadData();

		console.log(datas);
		
		initPointSelectors(datas, 10);
	};

	win.addEventListener("DOMContentLoaded", init);

})(window, document, window.lB);