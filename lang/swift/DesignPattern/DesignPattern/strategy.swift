//
//  strategy.swift
//  DesignPattern
//
//

import Foundation

private protocol Calculator {
    func calc<T: Integer>(_ lhs: T, _ rhs: T) -> T
}

private class Addition: Calculator {
    func calc<T: Integer>(_ lhs: T, _ rhs: T) -> T {
        return lhs + rhs
    }
}

private class Subtraction: Calculator {
    func calc<T: Integer>(_ lhs: T, _ rhs: T) -> T {
        return lhs - rhs
    }
}

private typealias Calc<T: Integer> = (T, T) -> T

private let Add: Calc<Int> = { $0 + $1 }

private let Sub: Calc<Int> = { $0 - $1 }

private class CalcManager<T> {
    private let method: Calc<T>
    init(method: @escaping Calc<T>) {
        self.method = method
    }
    func execute(_ lhs: T, _ rhs: T) -> T {
        return method(lhs, rhs)
    }
}

//typealiasにextensionを定義することはできない。
//private extension Calc {}

private func runAllCases() {
    let lhs = 10, rhs = 20
    //Protocol and class version
    //変数をCalculator型として扱いたければ左辺の型宣言を省略することはできない。
    //型宣言を省略すると型推論でAddition型になってしまう。
    var calculator: Calculator = Addition()
    print("\(lhs) + \(rhs) = \(calculator.calc(lhs, rhs))")
    calculator = Subtraction()
    print("\(lhs) - \(rhs) = \(calculator.calc(lhs, rhs))")
    //Function version
    var calc = Add
    print("\(lhs) + \(rhs) = \(calc(lhs, rhs))")
    calc = Sub
    print("\(lhs) - \(rhs) = \(calc(lhs, rhs))")
    //Class and functional delegation version
    var calman = CalcManager(method: Add)
    print("\(lhs) + \(rhs) = \(calman.execute(lhs, rhs))")
    calman = CalcManager(method: Sub)
    print("\(lhs) - \(rhs) = \(calman.execute(lhs, rhs))")
}

struct Strategy {
    static func main() {
        print("***** Strategy Pattern *****")
        runAllCases()
    }
}
