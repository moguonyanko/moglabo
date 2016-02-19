(function(win, doc, m){
    "use strict";
    
    function SampleInfo(info){
        this.name = info.name;
        this.age = info.age;
        this.memo = info.memo;
        this.password = info.password;
        
        m.freeze(this);
    }
    
    SampleInfo.prototype = {
        toString : function(){
            var s = `名前は${this.name}です。
            年齢は${this.age}です。
            パスワードは${this.password}です。
            追加情報は${this.memo}です。`;
            
            return s;
        }
    };
    
    /**
     * String Interpolationでメソッドを呼び出すことも可能。
     */
    function getSampleHTML(sampleInfo){
        var html = `
        <div>
            <p>名前:${sampleInfo.name}</p>
            <p>年齢:${sampleInfo.age}</p>
            <p>備考:${sampleInfo.memo}</p>
            <p>パスワード:${sampleInfo.password}</p>
    
            <em>${sampleInfo.toString()}</em>
        </div>
        `;
        
        return html;
    }
    
    var initTargets = [
        () => {
            m.clickListener("add-infomation", e => {
                var name = m.ref("sample-name").value,
                    age =  m.ref("sample-age").value,
                    memo =  m.ref("sample-memo").value,
                    password =  m.ref("sample-password").value;

                var sampleInfo = new SampleInfo({
                    name : name,
                    age : age,
                    memo : memo,
                    password : password
                });

                var html = getSampleHTML(sampleInfo);

                var targetContainer = m.ref("sample-infomation-container");
                targetContainer.innerHTML = html;
            });
        }
    ];
    
    m.loadedHook(() => initTargets.forEach(f => f()));
    
    /**
     * ofキーワードは反復対象が配列ではなくオブジェクトであった場合は
     * スクリプトエラーとなる。対象のオブジェクトに何らかのメソッドを
     * 実装していればエラーにならないのかもしれないが，inキーワードが
     * 配列とオブジェクトで相互運用しにくい問題を解決できないのでは
     * ofキーワードの意味が無いように思える。
     */
    //for(let target of initTargets){
    //    target();
    //}
}(window, document, my));
