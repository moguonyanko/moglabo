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
        },
        () => {
            const base = ".string-raw-container ",
                inputArea = m.select(base + ".input-sample-string"),
                outputArea = m.select(base + ".output-sample-string");
            
            const getSampleStringKey = () => {
                return m.selected(m.selectAll(base + ".select-sample-string"));
            };
            
            /**
             * String.rawの呼び出しは以下のように書くこともできる。
             * const rawString = String.raw({raw: "test\ntest"});
             * 
             * 別の変数や定数に保存された文字列をString.rawに渡しても
             * エスケープシーケンスを含むような元の文字列の値を得ることはできない。
             * 即ちString.rawの引数に変数や定数を渡しても望んだ結果は得られない。
             */
            const sampleStrings = {
                linefeedcode: String.raw `linefeed\ncode`,
                tab: String.raw `tab\ttab`,
                unicode: String.raw `unicode\u0030unicode`
            };
            
            m.clickListener(m.select(base + ".view-raw-string"), () => {
                const rawString = sampleStrings[getSampleStringKey()];
                m.println(outputArea, rawString);
            });
            
            m.clickListener(m.select(base + ".clear-output"), () => {
                m.clear(outputArea);
            });
        },
		() => {
			const base = ".tagged-template-sample",
				resultArea = m.select(base + " .result-area");
			
			const getSelectedLang = () => {
				const langs = m.selectAll(base + " .tag-lang");
				const selectedLang = Array.from(langs).filter(lang => lang.checked);
				return selectedLang[0].value;
			};
			
			const greetingParts = {
				ja: {
					prefix: "こんにちは",
					suffix: "さようなら"
				},
				en: {
					prefix: "Hello",
					suffix: "Goodbye"
				}
			};
			
			/**
			 * 第1引数は「${}を使わずに渡された文字列」の配列になる。
			 * 例えば sampleFunc`${a}and${b}` だった場合，第1引数は
			 * ["", "and", ""]
			 * になる。最初と最後の空文字も渡されてくることに注意。
			 * 
			 * 第2引数以降は「${}を使って渡された文字列」になる。
			 * sampleFunc`${a}and${b}` ならば${a}の評価結果が第2引数，
			 * ${b}の評価結果が第3引数になる。
			 */
			const greeting = (strings, prefix, name, suffix) => {
				let sep1 = strings[0],
					sep2 = strings[1],
					sep3 = strings[2],
					sep4 = strings[3];
					
				return sep1 + prefix + sep2 + name + sep3 + suffix + sep4;	
			};
			
            m.clickListener(m.select(base + " .runner"), () => {
				const selectedLang = getSelectedLang();
				const templates = greetingParts[selectedLang];
				const name = m.select(base + " .username").value || "anonymous";
				const result = greeting`★${templates.prefix}!${name},${templates.suffix}♪`;
				m.println(resultArea, result);
            });
            
            m.clickListener(m.select(base + " .clearer"), 
				() => m.clear(resultArea));
		}
    ];
    
    m.loadedHook(() => initTargets.forEach(f => f()));
}(window, document, window.goma));
