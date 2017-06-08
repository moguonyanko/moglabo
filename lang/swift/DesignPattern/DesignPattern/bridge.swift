//
//  bridge.swift
//  DesignPattern
//
//

import Foundation

private protocol Executor {
    associatedtype V
    func execute(_ args: [V]) -> V
}

private protocol Charger {
    associatedtype Arg
    associatedtype E: Executor
    //Executorを差し替えることで同じChargerでも振る舞いを変更できる。
    var executor: E { get }
    init(executor: E, args: [Arg])
    func work(_ fn: (Arg) -> Void)
}

//不変にできる概念はstructureで，不変にできない概念はclassで定義する。
private struct Adder: Executor {
    func execute(_ args: [Int]) -> Int {
        return args.reduce(0, { $0 + $1 })
    }
}

private struct Joiner: Executor {
    func execute(_ args: [String]) -> String {
        return args.joined(separator: " ")
    }
}

private final class SimpleCharger<E: Executor>: Charger {
    var executor: E
    private let args: [E.V]
    init(executor: E, args: [E.V]) {
        self.executor = executor
        self.args = args
    }
    func work(_ fn: (E.V) -> Void) {
        let result = executor.execute(args)
        fn(result)
    }
}

//以下のコードは動作しない。しかしコメントが有用なので残している。
//private class OfficeCalcManager<E: Executor>: Charger {
//    private let thisExecutor: E
//    //letで宣言するとconvenience initの中で初期化できない。
//    private var args: [Int]
//    //Computed propertyでprotocolの求めるプロパティを定義することで
//    //本体のプロパティをprivateで宣言できるようにする。
//    var executor: E {
//        return thisExecutor
//    }
//    //structureの場合requiredを書かなくてもよいがclassでは必要。
//    //requiredが無くてもOKにしてしまうとclassが継承された時に
//    //protocolが求めるプロパティの初期化が行われない恐れがあるためではないか。
//    //final classであればrequiredを指定する必要は無い。
//    init(executor: E, args: [Int]) {
//        self.args = [Int]()
//        self.args = args
//    }
//    func work(_ fn: (Int) -> Void) {
//        //TODO: コンパイルが通るように修正する。
//        //let result = executor.execute(args)
//        //fn(result)
//    }
//}

//associatedtypeを含んでいるとprotocolの名前を戻り値の型や引数の型として
//指定できなくなるのがかなり厳しい。この制約はなぜ存在するのだろいうか？
//private func getExecutor<E: Executor>(typeName: String) -> E 
//と宣言してもコンパイルエラーとなる。

//private func getExecutor(typeName: String) -> Executor {
//    if typeName == "adder" {
//        return Adder()
//    } else {
//        return Joiner()
//    }
//}

private func runAllCases() {
    let output = { print($0) }
    //var executor = getExecutor(typeName: "adder")
    let manager = SimpleCharger(executor: Adder(), args: [1, 2, 3, 4, 5])
    manager.work(output)
    //executor = getExecutor(typeName: "joiner")
    let manager2 = SimpleCharger(executor: Joiner(), args: ["I", "am", "Moguo"])
    manager2.work(output)
}

struct Bridge {
    static func main() {
        print("***** Bridge Pattern *****")
        runAllCases()
    }
}
