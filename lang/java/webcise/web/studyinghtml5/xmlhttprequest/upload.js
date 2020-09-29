(function (win, doc, m) {
    "use strict";

    var area = m.ref("UploadResultArea");

    function getXHR() {
        var xhr = new XMLHttpRequest();
        return xhr;
    }

    function getTargetFile() {
        var targetInput = m.ref("UploadTargetFile");
        return targetInput.files[0];
    }

    function eventLog(evt) {
        m.log(evt);
    }

    function reportError(evt) {
        alert(evt);
    }

    function setProgress(value) {
        var progress = m.ref("UploadProgress"),
                max = parseInt(progress.getAttribute("max"));
        if (max <= value) {
            progress.setAttribute("value", max);
            progress.innerHTML += max + "% upload!";
        } else {
            progress.setAttribute("value", value);
            progress.innerHTML += value + "% upload now...";
        }
    }

    function reportProgress(evt) {
        if (evt.lengthComputable) {
            var total = evt.total,
                    loaded = evt.loaded;

            var value = (loaded / total) * 100;
            setProgress(value);
        }
    }

    function upload() {
        var xhr = getXHR();
        xhr.open("POST", "https://myhost/webcise/Upload");
        /**
         * Content-Typeは自動的に「multipart/form-data」になりboundaryも
         * 自動的に生成される。自分で設定すると正しい「multipart/form-data」の
         * リクエストボディになっていないとしてサーバ側でエラーになる。
         */
        //var boundary = "; boundary=---------------------------sampleboundary2015";
        //xhr.setRequestHeader("Content-Type", "multipart/form-data" + boundary);

        /* サーバ側でエラーが起きてもloadstartとloadendは発生する。 */
        xhr.upload.onloadstart = eventLog;
        xhr.upload.onloadend = eventLog;
        xhr.upload.onprogress = reportProgress;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                var message = res.message;
                m.println(area, message, true);
            }
        };
        xhr.upload.onload = eventLog;
        xhr.upload.ontimeout = eventLog;
        xhr.upload.onabort = reportError;
        xhr.upload.onerror = reportError;

        var formData = new FormData();
        var file = getTargetFile();
        formData.append("samplefile", file);
        xhr.send(formData);
    }

    (function () {
        m.addListener(m.ref("UploadRunner"), "click", upload, false);
        m.addListener(m.ref("ClearProgress"), "click", function () {
            setProgress(0);
            m.println(area, "", true);
        }, false);
    }());
}(window, document, my));
