(function(win, doc, m) {
	"use strict";

	var idb = win.indexedDB;

	var dbName = "sampleDB";

	var version = 3;

	var sampleRecords = [
		{
			name : "foo",
			age : 20
		},
		{
			name : "baz",
			age : 33
		},
		{
			name : "cocoa",
			age : 15
		},
		{
			name : "sakura",
			age : 12
		},
		{
			name : "jiro",
			age : 45
		},
		{
			name : "hoge",
			age : 13
		},
		{
			name : "taro",
			age : 50
		},
		{
			name : "neko",
			age : 10
		},
		{
			name : "mike",
			age : 30
		},
		{
			name : "bar",
			age : 21
		}
	];

	var resultArea = el("InfoArea");

	function el(id) {
		return m.ref(id);
	}

	function log(txt) {
		m.println(resultArea, txt);
		m.log(txt);
	}

	function onUpgradeNeeded(evt) {
		var db = evt.target.result;

		var storeParams = {
			keyPath : "id",
			autoIncrement : true
		};

		var store = db.createObjectStore(dbName, storeParams);

		var indexParams = {
			unique : false
		},
		indexName = "storeIndex",
			indexColumn = "name";

		store.createIndex(indexName, indexColumn, indexParams);

		log(store);
	}

	function closeDB() {
		requestDB(function(db) {
			/**
			 * closeは同期メソッド。
			 */
			db.close();
			log("CLOSE DATABASE");
		});
	}

	function deleteDB() {
		requestDB(function(db) {
			/**
			 * IndexedDBがcloseされるまではdeleteは実行待ち状態になる。
			 */
			var deleteRequest = idb.deleteDatabase(dbName);
			deleteRequest.onerror = log;
			deleteRequest.onsuccess = log;
		});
	}

	function onAddRecordSuccess(evt) {
		log(evt);
	}

	function addRecord() {
		requestDB(function(db) {
			/* DBがCLOSEだとトランザクション開始不可能 */
			var transaction = db.transaction([dbName], "readwrite");
			var store = transaction.objectStore(dbName);

			/**
			 * putと異なり上書きせず追加する。 
			 * Keyが衝突するとエラーになる。
			 */
			for (var i = 0; i < sampleRecords.length; i++) {
				var addReq = store.add(sampleRecords[i]);
				addReq.onsuccess = onAddRecordSuccess;
				addReq.onerror = log;
			}
		});
	}

	function searchRecord(args) {
		requestDB(function(db) {
			var transaction = db.transaction([dbName], "readonly"),
				store = transaction.objectStore(dbName),
				cursorRequest;

			if (args.condition) {
				/**
				 * @todo
				 * 条件を指定して絞り込み検索
				 */
			} else {
				cursorRequest = store.openCursor();
				cursorRequest.onsuccess = function(evt) {
					var cursor = evt.target.result;
					if (cursor) {
						var resultValue = cursor.value;
						args.onsuccess(resultValue);
						cursor.continue();
					}
				};
			}
		});
	}

	function requestDB(requestFunc) {
		requestFunc = requestFunc || m.noop;

		/**
		 * 既にopenしている時に何度openを呼び出しても問題無い。
		 */
		var openRequest = idb.open(dbName, version);
		openRequest.onerror = log;
		/**
		 * 同じ名前で同じバージョンのIndexedDBが既に存在すれば
		 * onupgradeneededプロパティに設定されたハンドラは呼び出されない。
		 */
		openRequest.onupgradeneeded = onUpgradeNeeded;

		openRequest.onsuccess = function(evt) {
			var db = evt.target.result;
			requestFunc(db);
		};
	}

	function openDB() {
		requestDB(log);
	}

	function addClickListener(id, fn) {
		m.addListener(el(id), "click", fn, false);
	}

	function displayAllRecords() {
		searchRecord({
			condition : null,
			onsuccess : function(resultValue) {
				var record = [];
				for (var name in resultValue) {
					record.push(name + ":" + resultValue[name] + " ");
				}
				log(record.join(""));
			}
		});
	}

	(function() {
		m.addListener(win, "DOMContentLoaded", openDB, false);
		addClickListener("AddRecord", addRecord);
		addClickListener("DeleteDB", deleteDB);
		addClickListener("CloseDB", closeDB);
		addClickListener("display-all-records", displayAllRecords);
		addClickListener("result-clearer", function() {
			m.print(resultArea, "", true);
		});
	}());

}(window, document, my));
