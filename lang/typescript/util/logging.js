(function (Logging) {
    var Logger = (function () {
        function Logger() { }
        Logger.log = function log(txt) {
            if(print && Object.prototype.toString.call(print) === "[object Function]") {
                print(txt);
            } else {
                console.log(txt);
            }
        };
        return Logger;
    })();
    Logging.Logger = Logger;    
})(exports.Logging || (exports.Logging = {}));
var Logging = exports.Logging;
