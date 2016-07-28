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
	 * 画像を一度全て読み込みcanvasのサイズを決定してcanvas要素を生成する。
	 */
	const withCanvas = (imgFile, index, imgFiles, drawer) => {
		const img = doc.createElement("img");
		const url = lB.createBlobURL(imgFile);
		img.onload = () => {
			lB.revokeBlobURL(url);
			
			if(!drawer.minW || img.width < drawer.minW){
				drawer.minW = img.width;
			}
			if(!drawer.minH || img.height < drawer.minH){
				drawer.minH = img.height;
			}
			
			if(index >= imgFiles.length - 1){
				drawer(createCanvas(drawer.minW, drawer.minH));
			}
		}
		img.src = url;
	};
	
	/**
	 * canvasに画像を並べて描画する。
	 * canvasの描画結果は画像として右クリックから保存することができる。
	 * プログラム内でcanvasの描画結果をBlobに変換して保存する必要は無い。
	 */
	const draw = (canvas, imgFiles, onDrawn, 
		imgFile = imgFiles[0], ctx = canvas.getContext("2d"), col = 0, row = 0) => {
		const img = doc.createElement("img");
		const url = lB.createBlobURL(imgFile);
		img.onload = () => {
			lB.revokeBlobURL(url);
			
			ctx.drawImage(img, col * img.width, row * img.height);
			
			const nextImgFile = imgFiles[(col + 1) + getColumnSize() * row];
			if (nextImgFile) {
				const goToNextRow = (col + 1) * img.width >= canvas.width;
				if (goToNextRow) {
					col = 0;
					row += 1;
				} else {
					col += 1;
				}
				draw(canvas, imgFiles, onDrawn, nextImgFile, ctx, col, row);
			} else {
				onDrawn(canvas);
			}
		};
		img.src = url;
	};
		
	const combineImages = targetImages => {
		if(!targetImages || targetImages.length <= 0){
			return;
		}
		
		const func = ((imgFile, index, imgFiles) => withCanvas(imgFile, index, imgFiles, 
			(canvas => draw(canvas, imgFiles, 
				(canvas => lB.select(".image-container").replaceChild(canvas, lB.select(".image-container canvas")))))));
		
		lB.forEach(targetImages, func);
	};
	
	const init = () => {
		let selectedImages = [];
	
		lB.select(".file-selector").addEventListener("change", evt => {
			if(evt.target.files && evt.target.files.length > 0){
				selectedImages = Array.from(evt.target.files);
				combineImages(selectedImages);
			}
		}, false);
		
		lB.select(".image-remaker").addEventListener("click", 
			() => combineImages(selectedImages), false);
	};
	
	init();
	
})(window, document, window.lB));
