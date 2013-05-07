var Logging;
(function (Logging) {
    var Logger = (function () {
        function Logger() { }
        Logger.log = function log(txt) {
            if(print && typeof print === "function") {
                print(txt);
            }
        };
        return Logger;
    })();
    Logging.Logger = Logger;    
})(Logging || (Logging = {}));
