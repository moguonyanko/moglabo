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
		
		canvas.baseWidth = baseW;
		canvas.baseHeight = baseH;
		
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
			
			if(!drawer.maxW || img.width > drawer.maxW){
				drawer.maxW = img.width;
			}
			if(!drawer.maxH || img.height > drawer.maxH){
				drawer.maxH = img.height;
			}
			
			if(index >= imgFiles.length - 1){
				drawer(createCanvas(drawer.maxW, drawer.maxH));
			}
		}
		img.src = url;
	};
	
	const setImageSmoothingEnable = (ctx, enable) => {
		ctx.imageSmoothingEnabled = true;
		ctx.mozImageSmoothingEnabled = true;
		ctx.webkitImageSmoothingEnabled = true;
		ctx.msImageSmoothingEnabled = true;
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
			
			setImageSmoothingEnable(ctx, true);
			const dWidth = canvas.baseWidth,
				dHeight = canvas.baseHeight,
				dx = col * dWidth,
				dy = row * dHeight;
			ctx.drawImage(img, dx, dy, dWidth, dHeight);
			
			const colSize = getColumnSize();
			const nextImgFile = imgFiles[(col + 1) + colSize * row];
			if (nextImgFile) {
				const goToNextRow = (col + 1) >= colSize;
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
		
		/**
		 * 呼び出し元の配列に影響を与えないように念のため複製する。
		 */
		const clonedImages = [...targetImages];
		
		/**
		 * 以下のアロー関数を変数等に保存せずwithCanvasの引数として直接記述すると
		 * withCanvasの呼び出しのたびにアロー関数が生成される。
		 */
		const drawer = canvas => draw(canvas, clonedImages, 
				canvas => lB.select(".image-container").replaceChild(canvas, 
				lB.select(".image-container canvas")));
				
		lB.forEach(clonedImages, (imgFile, index, imgFiles) => 
			withCanvas(imgFile, index, imgFiles, drawer));
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
