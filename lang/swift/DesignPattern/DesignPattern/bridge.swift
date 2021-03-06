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

private protocol Teacher {
    func teach(quiestion: String)
}

private protocol Supporter {
    var teacher: Teacher { get }
    init(teacher: Teacher)
    func supprt()
}

private class MathTeacher: Teacher {
    func teach(quiestion: String) {
        print("\(quiestion) ... anyway 1 + 1 = 2")
    }
}

private class ChemistryTeacher: Teacher {
    func teach(quiestion: String) {
        print("\(quiestion) ... That is H2O")
    }
}

private class SupporterA: Supporter {
    var teacher: Teacher
    required init(teacher: Teacher) {
        self.teacher = teacher
    }
    func supprt() {
        teacher.teach(quiestion: "Who are you?")
    }
}

private class SupporterB: Supporter {
    var teacher: Teacher
    required init(teacher: Teacher) {
        self.teacher = teacher
    }
    func supprt() {
        teacher.teach(quiestion: "このパターンは無駄が多くないですか？")
    }
}

private enum TeacherType {
    case math, chemistry
}

private func getTeacher(type: TeacherType) -> Teacher {
    switch type {
    case .math:
        return MathTeacher()
    case .chemistry:
        return ChemistryTeacher()
    }
}

private func runAllCases() {
    var teacher: Teacher = getTeacher(type: .math)
    var supprter: Supporter = SupporterA(teacher: teacher)
    supprter.supprt()
    teacher = getTeacher(type: .chemistry)
    supprter = SupporterA(teacher: teacher)
    supprter.supprt()
    supprter = SupporterB(teacher: teacher)
    supprter.supprt()
}

struct Bridge {
    static func main() {
        print("***** Bridge Pattern *****")
        runAllCases()
    }
}
