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

func testStrategy() {
    print("Run strategy tests")
    let lhs = 10, rhs = 20
    var calculator: Calculator = Addition()
    print("\(lhs) + \(rhs) = \(calculator.calc(lhs, rhs))")
    calculator = Subtraction()
    print("\(lhs) - \(rhs) = \(calculator.calc(lhs, rhs))")
}
