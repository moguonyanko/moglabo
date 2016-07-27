(((win, doc, lB) => {
	"use strict";
	
	let selectedImages = [];
	
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
	 * canvasに画像を並べて描画する。
	 * canvasの描画結果は画像として右クリックから保存することができる。
	 * プログラム内でcanvasの描画結果をBlobに変換して保存する必要は無い。
	 */
	const combineSelectedImages = imgFiles => {
		if(!imgFiles || imgFiles.length <= 0){
			return;
		}
		
		const imgContainer = lB.select(".image-container");
		imgContainer.innerHTML = "";
		
		let canvas, ctx;
		let imgIdx = 0;
		
		const draw = (file, col, row) => {
			const img = doc.createElement("img");
			const url = lB.createBlobURL(file);
			img.onload = () => {
				lB.revokeBlobURL(url);
				
				ctx.drawImage(img, col * img.width, row * img.height);
				
				imgIdx += 1;
				
				const nextImgFile = imgFiles[imgIdx];
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
					draw(imgFiles[imgIdx], 0, 0);
				}
			}
			img.src = url;
		});
	};
	
	const init = () => {
		lB.select(".file-selector").addEventListener("change", evt => {
			if(evt.target.files && evt.target.files.length > 0){
				selectedImages = Array.from(evt.target.files);
				combineSelectedImages(selectedImages);
			}
		}, false);
		
		lB.select(".image-remaker").addEventListener("click", 
			() => combineSelectedImages(selectedImages), false);
	};
	
	lB.hookDocumentLoad(init);
	
})(window, document, window.lB));
