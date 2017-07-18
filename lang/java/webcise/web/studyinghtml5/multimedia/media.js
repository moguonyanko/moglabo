((win, doc) => {
    "use strict";
    
    const display = ({target, content}) => target.innerHTML += `${content}<br />`;
    const clear = ({target}) => target.innerHTML = "";
    
    const exams = {
        examineMediaElementProperty() {
            const base = doc.getElementById("media-element-property");
            const info = base.querySelector(".infomation");
            const video = base.querySelector(".video-container video");
            /**
             * ObjectのメソッドではHTMLElementのプロパティを列挙することができない。
             */
            //Object.getOwnPropertyNames(video).forEach(property => display(info, 
            //    `${property}=${video[property]}`));
            //Object.keys(video).forEach(property => display(info, 
            //    `${property}=${video[property]}`));
            
            const networkStates = {
                [HTMLMediaElement.NETWORK_EMPTY]: "初期化未完了",
                [HTMLMediaElement.NETWORK_IDLE]: "通信なし",
                [HTMLMediaElement.NETWORK_LOADING]: "動画データダウンロード中",
                // ページがブラウザキャッシュから読み込まれるとNETWORK_NO_SOURCEになる。
                [HTMLMediaElement.NETWORK_NO_SOURCE]: "リソースなし",
            };
            
            const preloadStates = {
                "none": "プリロードされない",
                "metadata": "メタデータのみプリロードする",
                "auto": "全てのデータをプリロードする"
            };
            
            const readyStates = {
                [HTMLMediaElement.HAVE_NOTHING]: "利用可能なデータなし",
                [HTMLMediaElement.HAVE_METADATA]: "メタデータはある",
                [HTMLMediaElement.HAVE_CURRENT_DATA]: "今の位置は再生できる",
                [HTMLMediaElement.HAVE_FUTURE_DATA]: "ちょっと先まで再生できる",
                [HTMLMediaElement.HAVE_ENOUGH_DATA]: "最後まで再生できる"
            };
            
            const checkVideoProperties = () => {
                const propertyInfomations = [
                    `自動再生=${video.autoplay ? "有効" : "無効"}`,
                    `動画コントロール=${video.controls ? "あり" : "なし"}`,
                    `現在の再生時間(秒)=${video.currentTime}`,
                    `再生が終了したか=${video.ended}`,
                    // リンク間違いなどで動画を読み込めなかった場合でもerrorプロパティは
                    // nullになってしまう。再生に関わるエラーしか検出できないのかもしれない。
                    `エラーが発生したか=${video.error ? video.error.message : "問題なし"}`,
                    // ChromeやSafariの動画コントロールにはループを指定する要素が
                    // 存在しないので必要なら独自に用意する。
                    `ループ再生=${video.loop ? "有効" : "無効"}`,
                    `リソースのダウンロード状況=${networkStates[video.networkState]}`,
                    // とにかく動画再生中でなければpausedはtrueになる。たとえば
                    // 再生を開始していない時や再生し終わった時でもpausedはtrueになる。
                    // すなわちpausedプロパティを介してユーザーが一時停止を試みたかどうかを
                    // 判別することはできないということである。
                    `一時停止中か=${video.paused}`,
                    `再生された量を反映したTimeRqangesの長さ=${video.played.length}`,
                    // preload空文字はautoと同じ。
                    `プリロード状態=${video.preload === "" ? "auto" : preloadStates[video.preload]}`,
                    `再生状態=${readyStates[video.readyState]}`
                ];
                display({target: info, content: propertyInfomations.join("<br/>")});
            };
            
            checkVideoProperties();
            
            base.querySelector(".checker").addEventListener("click", () => {
                clear({target: info});
                checkVideoProperties();
            });
            
            base.querySelector(".looper").addEventListener("click", () => {
                video.loop = !video.loop;
            });
        }
    };
    
    const init = () => {
        Object.keys(exams).forEach(key => exams[key]());
    };
    
    win.addEventListener("DOMContentLoaded", init);
})(window, document);
