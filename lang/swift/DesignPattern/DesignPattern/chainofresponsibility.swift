//
//  chainofresponsibility.swift
//  DesignPattern
//
//

import Foundation

private enum LogLevel: Int {
    case debug, info, warn, error, fatal
}

private protocol Logger {
    func output(message: String)
}

private class BaseLogger: Logger {
    private let next: BaseLogger!
    let level: LogLevel
    // convenience initだった場合，init内部で定数プロパティに値を設定できない。
    init(next: BaseLogger?, level: LogLevel) {
        self.next = next
        self.level = level
    }
//    convenience init(level: LogLevel) {
//        self.init(next: nil as Logger, level: level)
//    }
    func log(level: LogLevel, message: String) {
        if self.level.rawValue <= level.rawValue {
            output(message: message)
        }
        if let nextLogger = next {
            nextLogger.log(level: level, message: message)
        }
    }
    func output(message: String) {
        // Does nothing
    }
}

private class DatabaseLogger: BaseLogger {
    // super classと同じ引数を取るinitは他にinitが定義されていなければ暗黙で定義される。
    //override init(next: Logger, level: LogLevel) {
    //    super.init(next: next, level: level)
    //}
    override func output(message: String) {
        print("DB LOG:\(message)")
    }
}

private class StdoutLogger: BaseLogger {
    override func output(message: String) {
        print("STDOUT LOG:\(message)")
    }
}

struct ChainOfResponsibility {
    static func main() {
        let stdoutLogger = StdoutLogger(next: nil, level: .info)
        let sampleLogger = DatabaseLogger(next: stdoutLogger, level: .error)
        sampleLogger.log(level: .info, message: "Login")
        sampleLogger.log(level: .error, message: "Detected error")
    }
}
