/**
 * @fileOverview Canvasの新しいレンダリングコンテキスト調査用モジュール
 */

const drawImage = async ({blob, canvas}) => {
    // SafariTPではcreateImageBitmapにBlobを渡した時点でエラー。
    const bitmapImg = await createImageBitmap(blob);
    // 「bitmaprenderer」を指定しないとtransferFromImageBitmapメソッドが
    // 見つからずエラーになる。
    // canvasがドキュメントに追加済みの場合contextはnullになってしまう。
    // 現状のtransferFromImageBitmapメソッドはオフスクリーンのcanvasの
    // コンテキストに対してしか実行できないようである。
    // WebGLのCanvasで使用されることを想定されたAPIなのかもしれない。
    const context = canvas.getContext("bitmaprenderer");
    context.transferFromImageBitmap(bitmapImg);
};

const getBlob = ({canvas, mimeType = "image/png"}) => {
    return new Promise((resolve, reject) => {
        try {
            canvas.toBlob(blob => {
                resolve(blob);
            }, mimeType);
        } catch (err) {
            reject(err);
        }
    });
};

const runTest = async () => {
    const src = document.createElement("canvas");
    src.width = 300;
    src.height = 400;
    // OffscreenCanvasのgetContextを呼び出してコンテキストを得るには
    // getContextの引数にwebglを指定する必要がある。2dでは得られない。
    //const src = new OffscreenCanvas(300, 400);
    const context = src.getContext("2d");
    context.fillStyle = "red";
    context.fillRect(10, 10, 200, 300);

    const dist = document.createElement("canvas");
    const blob = await getBlob({
        canvas: src,
        mimeType: "image/jpeg"
    });
    await drawImage({
        blob,
        canvas: dist
    });
    console.log(dist);
};

const myCanvas = {
    drawImage,
    getBlob,
    test: {
        runTest
    }
};

export default myCanvas;
