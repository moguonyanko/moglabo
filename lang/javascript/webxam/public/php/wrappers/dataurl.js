const img = document.querySelector('.sampleimage');  
const canvas = document.createElement('canvas');
canvas.width = img.width;
canvas.height = img.height;
canvas.getContext('2d').drawImage(img, 0, 0);
// OffscreenCanvasにはtoDataURLが実装されていない。
const dataUrl = canvas.toDataURL();
// console.log(dataUrl);
const input = document.createElement('input');
input.id = 'sampleimagedataurl';
input.type = 'hidden';
input.value = dataUrl;
document.body.appendChild(input);
