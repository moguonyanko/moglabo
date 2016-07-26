(((win, doc, lB) => {
	"use strict";
	
	const getColumnSize = () => {
		const columnEle = lB.select(".column-size");
		return parseInt(columnEle.value);
	};
	
	const getRowSize = () => {
		const rowEle = lB.select(".row-size");
		return parseInt(rowEle.value);
	};
	
	const createCanvas = (baseW = 0, baseH = 0) => {
		const w = baseW * getColumnSize();
		const h = baseH * getRowSize();
		
		const canvas = doc.createElement("canvas");
		canvas.setAttribute("width", w);
		canvas.setAttribute("height", h);
		
		return canvas;
	};
	
	/**
	 * @todo
	 * 要整理。
	 * 
	 * 更新日時など元のファイル群の並び順に従った順序でしか画像を結合できない。
	 * 画像を1つずつ選択して結合するモードも用意した方がいいかもしれない。
	 */
	const combineSelectedImages = files => {
		if(!files || files.length <= 0){
			return;
		}
		
		const imgContainer = lB.select(".image-container");
		imgContainer.innerHTML = "";
		
		let canvas, ctx;
		
		const imgFiles = Array.from(files);
		
		const draw = (file, col, row) => {
			const img = doc.createElement("img");
			const url = lB.createBlobURL(file);
			img.onload = () => {
				lB.revokeBlobURL(url);
				
				ctx.drawImage(img, col * img.width, row * img.height);
				
				const nextImgFile = imgFiles.shift();
				if (nextImgFile) {
					const goToNextRow = (col + 1) * img.width >= canvas.width;
					if (goToNextRow) {
						col = 0;
						row += 1;
					} else {
						col += 1;
					}
					draw(nextImgFile, col, row);
				} else {
					imgContainer.appendChild(canvas);
				}
			};
			img.src = url;
		};
		
		/**
		 * 画像を一度全て読み込みcanvasのサイズを決定してcanvas要素を生成する。
		 */
		let minW, minH;
		
		lB.forEach(imgFiles, (imgFile, index) => {
			const img = doc.createElement("img");
			const url = lB.createBlobURL(imgFile);
			img.onload = () => {
				lB.revokeBlobURL(url);
				
				if(!minW || img.width < minW){
					minW = img.width;
				}
				if(!minH || img.height < minH){
					minH = img.height;
				}
				
				if(index >= imgFiles.length - 1){
					canvas = createCanvas(minW, minH);
					ctx = canvas.getContext("2d");
					draw(imgFiles.shift(), 0, 0);
				}
			}
			img.src = url;
		});
	};
	
	/**
	 * Chromeでは選択したファイルがそれ以前に選択されたファイルと同じだった場合
	 * changeイベントが発生しない。Firefoxでは発生する。
	 */
	const init = () => lB.hookChange(lB.select(".file-selector"), evt => {
		combineSelectedImages(evt.target.files);
	});
	
	lB.hookDocumentLoad(init);
	
})(window, document, window.lB));
