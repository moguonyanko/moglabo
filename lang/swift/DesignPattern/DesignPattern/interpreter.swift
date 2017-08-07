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

private protocol OOperand {
    func eval<V>(context: [String: V]) -> V.Type
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

private class Expression: DoubleOperand {
    let opr: Operator
    var left: DoubleOperand!
    var right: DoubleOperand!
    init(opr: Operator) {
        self.opr = opr
    }
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

private func makeSyntaxTree(src: String) -> [DoubleOperand] {
    let tokens = src.split(separator: " ")
    var tree = [DoubleOperand]()
    var expression: Expression?
    for token in tokens {
        let t = token.description
        if let op = Operator(rawValue: t) {
            if let l = tree.popLast(), let r = tree.popLast(), let e = expression {
                e.left = l
                e.right = r
                tree.append(e)
            }
            expression = Expression(opr: op)
        } else {
            var x: DoubleOperand
            if let v = Double(t) {
                x = Literal(value: v)
            } else {
                x = Variable(name: t)
            }
            tree.append(x)
        }
    }
    return tree
}

// TODO: 計算結果が誤っている。
struct Interpreter {
    static func main() {
        let src = "x + y - 0.5"
        let tree = makeSyntaxTree(src: src)
        // DoubleとIntの値を混ぜた場合Doubleに統一される。
        let context = [
            "x": 5.5,
            "y": 10.5
        ]
        let result = tree.first!.eval(context: context)
        print("\(src) = \(result)")
    }
}
