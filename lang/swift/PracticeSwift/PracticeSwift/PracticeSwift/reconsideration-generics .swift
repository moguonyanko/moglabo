//
//  reconsideration-generics .swift
//  PracticeSwift
//
//

import Foundation

private protocol Calculator {
    associatedtype Value
    func add(_ lhs: Value, _ rhs: Value) -> Value
}

private struct BasicCalculator: Calculator {
    //func add(_ lhs: Int, _ rhs: Int) -> Int {
    //    return lhs + rhs
    //}
    //protocolがジェネリクスでメソッド宣言していてもoverloadするとコンパイルエラーになる。
    func add(_ lhs: Double, _ rhs: Double) -> Double {
        return lhs + rhs
    }
}

private struct BiCalculator<Element: Integer>: Calculator {
    private let values: (Element, Element)
    init(_ values: (Element, Element)) {
        self.values = values
    }
    func add(_ lhs: Element, _ rhs: Element) -> Element {
        return lhs + rhs
    }
    func add() -> Element {
        return add(values.0, values.1)
    }
}

//protocolにはmethod・computed property・subscriptだけ宣言するのが安全？
//associatedtypeを使うpropertyは書かない方が実装する側の負担を減らせる。
//以下の例では試しに書いている。
private protocol CalculatorIncludedValues {
    associatedtype Value
    func sum() -> Value
    var values: [Value] { get }
}

private struct AllValuesCalculator<Element: Integer>: CalculatorIncludedValues {
    var values = [Element]()
    func sum() -> Element {
        return values.reduce(0, { $0 + $1 })
    }
}

private func testAllValuesCalculator() {
    let c = AllValuesCalculator(values: [1, 2, 3, 4, 5])
    print("\(c.sum())")
}

private protocol Term {
    associatedtype Value
    var value: Value { get }
    //SelfをTermと書くとコンパイルエラー。
    static func +(lhs: Self, rhs: Self) -> Self
}

private extension Term {
    var description: String {
        return String(describing: value)
    }
}

private struct MyTerm: Term {
    var value = 0
    //以下のtypealiasはあってもなくても結果に変化は無い。ただしvalueの型とは異なる型を
    //指定するとコンパイルエラーになる。
    //typealias Value = Int
    static func +(lhs: MyTerm, rhs: MyTerm) -> MyTerm {
        return MyTerm(value: lhs.value + rhs.value)
    }
}

//Termはassociatedtypeを使っているため戻り値の型に指定できない。
//しかしジェネリクス型を戻り値に指定してもコンパイルエラーになる。
//private func getZeroTerm<T: Term>() -> T {
//    return MyTerm(value: 0)
//}

private func testMyTerms() {
    let term1 = MyTerm(value: 100),
        term2 = MyTerm(value: 200)
    print("\((term1 + term2).description)")
}

private protocol TermManager {
    associatedtype T
    func sum() -> T
}

private protocol Mapper {
    associatedtype T
    associatedtype U
    func map(_ arg: T) -> U
    //associatedtype無しでprotocolにジェネリックメソッドは宣言できないのでは？
    //正確には宣言したところでprotocolのの要求に従うclassやstructを定義できない。
    //func map<T, U>(_ arg: T) -> U
}

private class MyMapper: Mapper {
    //以下ではprotocolのジェネリックメソッドの要求を満たせない。
    //func map<T, U>(_ arg: T) -> U where T: Integer, U: String {
    //    return arg.description
    //}

    //以下もエラー。
    //func map<T: Integer, U: String>(_ arg: T) -> U {
    //    return arg.description
    //}

    func map(_ arg: Int) -> String {
        return arg.description
    }
}

//Termを型として指定すると以下のコードはコンパイルエラーとなる。
//associatedtypeを含むprotocolに従うclassやstructのプロパティは
//具象的な型を早々に指定するしかないのかもしれない。
//以下の例ではTermと指定したい箇所を全てMyTermにすることでエラーを回避している。
//associatedtypeを使うことでprotocolの宣言に柔軟性を持たせることは可能になるが，
//protocolに従うclassやstructの抽象度は低下する・・・ということだろうか。
private class MyTermManager: TermManager {
    private let terms: [MyTerm?]
    init(terms: [MyTerm]) {
        self.terms = terms
    }
    func sum() -> MyTerm {
        guard var result = terms[0] else {
            return MyTerm(value: 0)
        }
        for index in 1..<terms.count {
            let tmp = result + terms[index]!
            result = tmp
        }
        return result
    }
}

//Mapperを戻り値の型には指定できない。associatedtypeを使っているため。
private func getMapper() -> MyMapper {
    return MyMapper()
}

//getMapper1とgetMapper2はコンパイルに成功するが実体の型ではなくTを返してしまう。
//as!でTに型変換しなければコンパイルに成功しない。
private func getMapper1<T: Mapper>() -> T {
    return MyMapper() as! T
}

private func getMapper2<T>() -> T where T: Mapper {
    return MyMapper() as! T
}

private func testMyMapper() {
    //mapperの型をMapperと明示的に指定するとコンパイルエラーとなる。
    let mapper = getMapper()
    print("\(mapper.map(100))")
}

private func testTermManager() {
    let mn = MyTermManager(terms: [
        MyTerm(value: 100), MyTerm(value: 250), MyTerm(value: 450)
    ])
    print("\(mn.sum().description)")
}

//Test functions array
private let sampleFuncs = [
    {
        let calclator = BasicCalculator()
        print("\(calclator.add(1.1, 4.5))")
    },
    {
        let bc = BiCalculator((10, 20))
        print("\(bc.add())")
    },
    testAllValuesCalculator,
    testMyTerms,
    testMyMapper,
    testTermManager
]

struct ReconsiderationGenerics {
    static func main() {
        sampleFuncs.forEach { $0() }
    }
}
