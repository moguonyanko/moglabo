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
            let s = `名前は${this.name}です。
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
        let html = `
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
    
    let initTargets = [
        () => {
            m.clickListener("add-infomation", e => {
                let name = m.ref("sample-name").value,
                    age =  m.ref("sample-age").value,
                    memo =  m.ref("sample-memo").value,
                    password =  m.ref("sample-password").value;

                let sampleInfo = new SampleInfo({
                    name : name,
                    age : age,
                    memo : memo,
                    password : password
                });

                let html = getSampleHTML(sampleInfo);

                let targetContainer = m.ref("sample-infomation-container");
                targetContainer.innerHTML = html;
            });
        }
    ];
    
    m.loadedHook(() => initTargets.forEach(f => f()));
}(window, document, my));
