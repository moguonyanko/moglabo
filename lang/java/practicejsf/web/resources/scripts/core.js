(((w, d) => {
	"use strict";
	
	const refelt = (id, opt_doc) => (opt_doc || d).getElementById(id);
	/**
	 * querySelectorに渡すセレクタにコロン(:)が含まれているとシンタックスエラーになる。
	 * コロン(:)はFaceletsページを解析するアプリケーションサーバ側で自動的に付与される。
	 * 従ってFaceletsページを制御するスクリプトでquerySelectorは使いにくい。
	 */
	const selelt = (selector, opt_doc) => (opt_doc || d).querySelector(selector);
	const selelts = (selector, opt_doc) => (opt_doc || d).querySelectorAll(selector);
	
	const log = data => w.console.log(data);
	
	const cloneArray = array => [...array];
	
	const makeNS = (names, root, node) => {
		if(names.length <= 0){
			/**
			 * 作成した名前空間のルートと末端の参照を配列にして返す。
			 */
			return [root, node];
		}
		
		const name = names.shift();
		if (!(name in node)) {
			node[name] = {};
		}
		
		return makeNS(names, root, node[name]);
	};
		
	const includeScripts = name => {
		const names = name.split(".");
		const rootName = names[0];
		
		const root = {};
		const [rt, nd] = makeNS([...names], root, root);
		
		/* 作成した名前空間をWindowオブジェクト以下に保存して公開する。 */
		w[rootName] = rt[rootName];
		
		return nd;
	};

	const rootNS = includeScripts("jp.ne");

	rootNS.practicejsf = rootNS.pj = {
		includeScripts: includeScripts,
		util: {
			refelt: refelt,
			selelt: selelt,
			selelts: selelts,
			log: log,
			cloneArray: cloneArray
		}
	};
})(window, document));
