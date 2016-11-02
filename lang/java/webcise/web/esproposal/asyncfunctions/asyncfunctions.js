((win, doc, g) => {
	"use strict";

	const loadJSON = async url => {
		/**
		 * async/awaitを指定しない場合，以下の呼び出しはPromiseを返す。
		 * awaitはPromiseのthenに近い処理を行っているものと思われる。
		 */
		const json = await g.fetch(url);

		/**
		 * 非同期関数呼び出しでawaitを指定せずPromiseが返された場合，
		 * Promiseの処理結果に対するエラーチェックを行うにはthenあるいは
		 * catchのコールバック内で行うことになる。そのため関数の呼び出し元に
		 * 例外を伝搬するのが難しくなる。
		 */
		if (!json) {
			throw new Error(`Failed load ${url}.`);
		}

		return json;
	};

	class AsyncBasicExam {
		constructor(sectionName) {
			this.base = g.sel(sectionName);
		}

		setup() {
			const resultArea = g.sel(".result-area", this.base),
				runner = g.sel(".async-runner", this.base),
				clearer = g.sel(".result-clearer", this.base);

			/**
			 * asyncが指定されていないブロック内にawaitを書くとシンタックスエラーになる。
			 */
			g.clickListener(runner, async () => {
				let json = {};
				
				try{
					/**
					 * async/awaitを指定しないと空のJSONが返される。
					 * async/awaitを使うことで例外が伝搬しやすくなり，
					 * 非同期処理中に発生した例外を呼び出し側で処理しやすくなる。
					 */
					json = await loadJSON("sample.json");
				} catch (err) {
					json.message = `Load error: ${err.message}`;
				}
				
				/**
				 * async/awaitを使わない場合，以下のように非同期処理に後続する処理は
				 * 非同期関数のコールバックとして渡す必要がある。
				 */
				g.println(resultArea, JSON.stringify(json));
			});

			g.clickListener(clearer, () => g.clear(resultArea));
		}
	}

	function main() {
		const exams = [ new AsyncBasicExam(".async-sample") ];
		exams.forEach(exam => exam.setup());
	}

	g.loadedHook(main);
})(window, document, goma);
