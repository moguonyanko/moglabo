//
//  visitor.swift
//  DesignPattern
//
//

import Foundation

private protocol NumberVisitor {
    func visit(_ target: CheckedNumber)
    var visited: [CheckedNumber] { get }
}

private protocol CheckedNumber {
    func accept(_ visitor: NumberVisitor)
    var number: Int { get }
}

//Intを自作のprotocolで拡張するテスト
extension Int: CheckedNumber {
    //protocolにfileprivateは指定できないがこの場面ではfileprivateを指定しないとエラーになる。
    //引数にprivateな型が含まれているためである。
    fileprivate func accept(_ visitor: NumberVisitor) {
        visitor.visit(self)
    }
    var number: Int {
        return self
    }
}

private class MyCode: CheckedNumber {
    fileprivate var number: Int
    init(_ number: Int) {
        self.number = number
    }
    func accept(_ visitor: NumberVisitor) {
        visitor.visit(self)
    }
}

//共通で定義されるべき振る舞いや性質ではあるが，個々のオブジェクトによってその内容が
//変化しない要素はextensionで定義する価値がある。
//例えばresultNumbersプロパティの振る舞いがEvenNumberVisitorとOverNumberVisitorで
//異なっているならば，resultNumbersはprotocolで宣言されるべきである。
//extensionは主にユーティリティな関数やプロパティをまとめるのに使うと考えればよいか？
private extension NumberVisitor {
    var resultNumbers: [Int] {
        return visited.map { $0.number }
    }
}

private class EvenNumberVisitor: NumberVisitor {
    lazy var visited = [CheckedNumber]()
    func visit(_ target: CheckedNumber) {
        let n = target.number
        if (n % 2) == 0 {
            visited.append(target)
        }
    }
}

private class OverNumberVisitor: NumberVisitor {
    lazy var visited = [CheckedNumber]()
    private let border: Int
    init(border: Int) {
        self.border = border
    }
    func visit(_ target: CheckedNumber) {
        let n = target.number
        if n > border {
            visited.append(target)
        }
    }
}

private func runAllCases() {
    let numbers = [34, 11, 17, 88, 65, 3, 90, 42, 0, 19]
    let targets = numbers.map { x in MyCode(x) }
    let evenVisitor = EvenNumberVisitor()
    targets.forEach { evenVisitor.visit($0) }
    //クロージャを連結することもできる。
    //numbers.map { x in MyCode(x) }.forEach { visitor.visit($0) }
    print("result = \(evenVisitor.resultNumbers)")
    let overVisitor = OverNumberVisitor(border: 25)
    targets.forEach { overVisitor.visit($0) }
    print("result = \(overVisitor.resultNumbers)")
}

struct Visitor {
    static func main() {
        runAllCases()
    }
}
