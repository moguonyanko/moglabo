/**
 * @fileoverview URLを使ったJavaScript及びNodeJSのAPI調査用スクリプト
 * 参考:
 * https://www.w3schools.com/nodejs/nodejs_http.asp
 */

const funcs = {
    async echoQuery() {
        const date = new Date();
        const sampleUrl =
            `/webxam/service/echoQuery?year=${date.getFullYear()}&month=${date.getMonth() + 1}&date=${date.getDate()}`;
        const response = await fetch(sampleUrl);
        if (!response.ok) {
            throw new Error(`Request is failed: ${response.status}`);
        }
        const json = await response.json();
        return json.value;
    },
    // 引数を配列で受け取りつつ引数名を決定する記述方法
    // ただしこの方法はドキュメントやJSON等から引数がどういう順序で取得されるかに
    // 強く依存してしまう。
    //constructUrl([ url, base ]) {
    constructUrl({ url, base }) {
        try {
            // 第1引数のオリジンが常に優先される。
            // 第2引数は末尾のスラッシュの有無で振る舞いが変わる。
            // httpなど正当なスキームが指定されている場合はスラッシュがなくても
            // 正常にコンストラクタ呼び出しが完了する。正当なスキームが指定されて
            // いない場合はエラーになる。しかしスラッシュが末尾に記述されていれば
            // どんなスキームが指定されていてもコンストラクタ呼び出しは正常に完了する。
            // ホストが指定されていない場合は当然エラーになる。
            // 誤ったスキームを指定された場合に即失敗させたい場合は第2引数の末尾に
            // スラッシュを記述するべきではない。
            const u = new URL(url, base);
            return u.toString();
        } catch (err) {
            return err.message;
        }
    },
    testUrl: ({ url, pathname }) => {
        const pattern = new URLPattern({ pathname })
        
        return JSON.stringify({
            test: pattern.test(url),
            exec: pattern.exec(url).pathname.groups
        })
    }
};

// DOM

const getParams = root => {
    const paramEles = root.querySelectorAll('.param[data-param-name]');
    return Array.from(paramEles).map(ele => {
        const param = {
            [ele.dataset.paramName]: ele.value
        };
        return param;
    }).reduce((acc, current) => Object.assign(acc, current), {});
};

window.addEventListener('DOMContentLoaded', () => {
    Array.from(document.querySelectorAll('section.example')).forEach(root => {
        root.addEventListener('pointerup', async event => {
            const element = event.target;
            if (element.dataset.eventTarget) {
                event.stopPropagation;
                const func = funcs[element.dataset.eventTarget];
                if (typeof func === 'function') {
                    const params = getParams(root);
                    const output = root.querySelector('.output');
                    try {
                        const result = await func(params);
                        output.appendChild(document.createTextNode(result));
                    } catch (err) {
                        output.appendChild(document.createTextNode(err.message));
                    } finally {
                        output.appendChild(document.createElement('br'));
                    }
                }
            }
        });
    });
});
