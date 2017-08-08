//
//  interpreter.swift
//  DesignPattern
//
// Reference:
// https://sourcemaking.com/design_patterns/interpreter/java/1
//

import Foundation

private protocol Operand {
    associatedtype Value
    func eval(context: [String: Value]) -> Value
}

// generic methodは非常に使い辛い。
// 呼び出した側で型を解決できない。
private protocol OOperand {
    func eval<V>(context: [String: V]) -> V
}

private protocol Term: Operand {
    func eval(context: [String: Double]) -> Double
}

private protocol DoubleOperand {
    func eval(context: [String: Double]) -> Double
}

private struct Literal: DoubleOperand {
    let value: Double
    func eval(context: [String: Double]) -> Double {
        return value
    }
}

private struct Variable: DoubleOperand {
    let name: String
    func eval(context: [String: Double]) -> Double {
        // guardを使わない場合，Dictionaryから値を取得した後にoptional typeのunwrapを
        // 別途行わなければならない。optional typeを返すメソッドならその必要は無いが，使い勝手を
        // 考慮するとoptional typeを返すのはなるべく避けたい。
        //if context.keys.contains(where: name) {
        //    let value = context[name]
        //    return value // compile error
        //}
        guard let value = context[name] else {
            return 0
        }
        return value
    }
}

//private extension Term {
//    static func + (left: Term, right: Term) -> Term {
//
//    }
//}

private enum Operator: String {
    case plus = "+", minus = "-", multi = "*", div = "/"
}

// Expressionがclassとして宣言されていた場合，そのオブジェクトが定数で宣言されていても
// プロパティに値を代入することができる。structで宣言されていた場合はコンパイルエラーになる。
private struct Expression: DoubleOperand {
    let opr: Operator
    var left: DoubleOperand
    var right: DoubleOperand
    func eval(context: [String: Double]) -> Double {
        // leftやrightがOperand型だった場合はevalメソッドを呼べない。
        // generic typeを含む引数に具象的な型情報を持つcontext変数を渡しても
        // 型を解決することができない。コンパイラの欠陥ではないだろうか。
        let l = left.eval(context: context)
        let r = right.eval(context: context)
        switch opr {
        case .plus:
            return l + r
        case .minus:
            return l - r
        case .multi:
            return l * r
        case .div:
            return l / r
        }
    }
}

private struct NullExpression: DoubleOperand {
    func eval(context: [String : Double]) -> Double {
        return 0
    }
}

private enum OperandError: Error {
    case notFoundExpression(message: String)
}

// 引数srcは逆ポーランド記法で記述されている必要がある。
private func makeOperand(src: String) throws -> DoubleOperand {
    var stack = [DoubleOperand]()
    let tokens = src.split(separator: " ").map { $0.description }
    for token in tokens {
        if let op = Operator(rawValue: token) {
            if let left = stack.popLast(), let right = stack.popLast() {
                let expression = Expression(opr: op, left: left, right: right)
                stack.append(expression)
            }
        } else {
            var x: DoubleOperand
            if let v = Double(token) {
                x = Literal(value: v)
            } else {
                x = Variable(name: token)
            }
            stack.append(x)
        }
    }
    guard let operand = stack.popLast() else {
        throw OperandError.notFoundExpression(message: "Not found expression")
    }
    return operand
}

struct Interpreter {
    static func main() {
        let src = "x y + 10 -"
        do {
            let operand = try makeOperand(src: src)
            // DoubleとIntの値を混ぜた場合Doubleに統一される。
            let context = [
                "x": 2.5,
                "y": 7.5
            ]
            let result = operand.eval(context: context)
            print("\(src) = \(result)")
        } catch OperandError.notFoundExpression(let msg) {
            print("\(msg)")
        } catch {
            print("Failed making syntax tree")
        }
    }
}
