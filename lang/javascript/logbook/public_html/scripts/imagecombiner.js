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
	
	class CombiledImageCanvas {
		constructor (baseWidth = 0, baseHeight = 0, smooth = true) {
			this.baseWidth = baseWidth;
			this.baseHeight = baseHeight;
			
			const canvas = doc.createElement("canvas");
			canvas.setAttribute("width", baseWidth * getColumnSize());
			canvas.setAttribute("height", baseHeight * getRowSize());
			this.canvas = canvas;
			this.context = canvas.getContext("2d");
			this.setImageSmoothingEnable(smooth);
		}
		
		get width () {
			return this.canvas.width;
		}
		
		get height () {
			return this.canvas.height;
		}
		
		get element () {
			return this.canvas;
		}
		
		setImageSmoothingEnable (enable) {
			this.context.imageSmoothingEnabled = enable;
			this.context.mozImageSmoothingEnabled = enable;
			this.context.webkitImageSmoothingEnabled = enable;
			this.context.msImageSmoothingEnabled = enable;
		}
		
		/**
		 * 全ての画像はcanvas生成時の基準となった画像のサイズに合わせるように
		 * 拡大・縮小されて描画される。
		 */
		drawImage (img, xIndex, yIndex) {
			const dx = xIndex * this.baseWidth,
				dy = yIndex * this.baseHeight;
			this.context.drawImage(img, dx, dy, this.baseWidth, this.baseHeight);
		}
	}
	
	class CanvasBuilder {
		constructor (imgFiles) {
			this.maxW = 0;
			this.maxH = 0;
			this.imgFiles = imgFiles;
		}
		
		/**
		 * 画像を一度全て読み込みcanvasのサイズを決定してから
		 * CombiledImageCanvasオブジェクトを生成する。
		 * canvasのサイズは最も大きい画像のサイズを基準にして決定する。
		 */
		build (callback) {
			this.imgFiles.forEach((imgFile, index) => {
				const img = new Image();
				const url = lB.createBlobURL(imgFile);
				img.onload = () => {
					lB.revokeBlobURL(url);

					if(img.width > this.maxW){
						this.maxW = img.width;
					}
					if(img.height > this.maxH){
						this.maxH = img.height;
					}

					if(index >= this.imgFiles.length - 1){
						callback(new CombiledImageCanvas(this.maxW, this.maxH));
					}
				};
				img.src = url;
			});
		}
	}
	
	/**
	 * canvasに画像を並べて描画する。
	 * canvasの描画結果は画像として右クリックから保存することができる。
	 * プログラム内でcanvasの描画結果をBlobに変換して保存する必要は無い。
	 */
	const draw = (combinedImageCanvas, imgFiles, callback = lB.noop, 
		imgFile = imgFiles[0], col = 0, row = 0) => {
		const img = doc.createElement("img");
		const url = lB.createBlobURL(imgFile);
		img.onload = () => {
			lB.revokeBlobURL(url);
			
			combinedImageCanvas.drawImage(img, col, row);
			
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
				draw(combinedImageCanvas, imgFiles, callback, nextImgFile, col, row);
			} else {
				callback(combinedImageCanvas);
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
		
		const imageContainerClassName = ".image-container";
		
		const drawCallback = combinedImageCanvas => 
				lB.select(imageContainerClassName).replaceChild(combinedImageCanvas.element, 
				lB.select(imageContainerClassName + " canvas"));
		
		const drawFunc = combinedImageCanvas => draw(combinedImageCanvas, 
			clonedImages, drawCallback);
				
		const builder = new CanvasBuilder(clonedImages);
		builder.build(drawFunc);
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
