
var UnitTest;
(function (UnitTest) {
    var Assertions = (function () {
        function Assertions() { }
        Assertions.assert = function assert(a) {
            if(!a) {
                throw new Error("FAILED(-_-;)");
            }
        };
        Assertions.assertEquals = function assertEquals(ans, res) {
            try  {
                var arrayStr = "[object Array]";
                if(Object.prototype.toString.call(ans) !== arrayStr && Object.prototype.toString.call(res) !== arrayStr) {
                    for(var i = 0, len = res.length; i < len; i++) {
                        Assertions.assert(res[i] === ans[i]);
                    }
                } else {
                    Assertions.assert(ans === res);
                }
                print("OK(*^_^*)b");
            } catch (e) {
                Logger.log(e.message);
                Logger.log("ANSWER:" + ans);
                Logger.log("RESULT:" + res);
            }
        };
        return Assertions;
    })();
    UnitTest.Assertions = Assertions;    
})(UnitTest || (UnitTest = {}));
