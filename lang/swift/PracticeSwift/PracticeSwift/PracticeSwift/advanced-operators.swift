//
//  advanced-operators.swift
//  PracticeSwift
//
//  Advanced Operators practices
//

import Foundation

//Operator Methods
private struct Coords: Equatable {
    var x = 0
    var y = 0
    var description: String {
        return "(\(x),\(y))"
    }
}

//structureやclassが本質的に持っているべき性質として妥当でないものは
//extensionとして定義する。
private extension Coords {
    static func + (lhs: Coords, rhs: Coords) -> Coords {
        return Coords(x: lhs.x + rhs.x, y: lhs.y + rhs.y)
    }
    //=は演算子オーバーロド不可
    //static func = (lhs: Coords, rhs: Coords) -> Coords {}
}

func calcFormulaWithOperatorMethod() {
    let c1 = Coords(x: 1, y: 3)
    let c2 = Coords(x: 4, y: -8)
    let result = c1 + c2
    print("\(c1.description) plus \(c2.description) equals \(result.description)")
}

//Prefix and Postfix Operators
private extension Coords {
    static prefix func - (coords: Coords) -> Coords {
        return Coords(x: -coords.x, y: -coords.y)
    }
    static prefix func ++ (coords: Coords) -> Coords {
        print("Coords is incremented by prefix \"++\"")
        return Coords(x: coords.x + 1, y: coords.y + 1)
    }
    static postfix func ++ (coords: Coords) -> Coords {
        print("Coords is incremented by postfix \"++\"")
        return Coords(x: coords.x + 1, y: coords.y + 1)
    }
}

func convertValueByUnaryOperator() {
    let coords = Coords(x: 10, y: 20)
    let negativeCoords = -coords
    print("\(coords.description) convert to \(negativeCoords.description) by minus prefix")
    let alsoPositiveCoords = -negativeCoords
    print("\(negativeCoords.description) convert to \(alsoPositiveCoords.description) by minus prefix")
    print("Is equal original coords and also positive coords? : \(coords == alsoPositiveCoords)")
    //prefixとpostfixで同じ演算子をオーバーロードした場合，postfixが先に適用される。
    let newCoords = ++coords++
    print("\(coords.description) incremented to \(newCoords.description)")
}

//Compound Assignment Operators
private extension Coords {
    static func += (lhs: inout Coords, rhs: Coords) {
        lhs = lhs + rhs
    }
}

func calcBycompoundAssignmentOperator() {
    var p1 = Coords(x: 3, y: 4)
    let p2 = Coords(x: 2, y: 6)
    p1 += p2
    print("Compounded result = \(p1.description)")
}

//Equivalence Operators
private extension Coords {
    //このextensionの対象となるstructureが従うprotocolの実装を
    //extension内に記述することができる。このときstructureの方に
    //protocolの実装が存在しなくてもコンパイルエラーにならない。
    //なおstructureがEquatableに従うと宣言されていなくても==や!=を
    //オーバーロードすることはできる。
    static func ==(lhs: Coords, rhs: Coords) -> Bool {
        return lhs.x == rhs.x && lhs.y == rhs.y
    }
    static func !=(lhs: Coords, rhs: Coords) -> Bool {
        return !(lhs == rhs)
    }
}

func checkEquivalenceWithOverloadedOperators() {
    let a = Coords(x: 1, y: 1)
    let b = Coords(x: 8, y: -3)
    let c = Coords(x: 1, y: 1)
    print("Is not equal \(a.description) and \(b.description): \(a != b)")
    print("Is equal \(a.description) and \(c.description): \(a == c)")
}

//Custom Operators
//custom operatorを定義するにはoperator演算子による宣言を行う必要がある。
//宣言にアクセスレベル修飾子を記述することはできない。
postfix operator ***

private extension String {
    static postfix func *** (string: String) -> String {
        var s = [String]()
        for _ in 0..<string.characters.count {
            s.append("*")
        }
        return s.joined()
    }
}

func convertValueByCustomOperator() {
    let org = "'secret password'"
    print("\(org) is converted to \(org***)")
}

//Precedence for Custom Infix Operators
//計算優先度のグループをMultiplicationPrecedenceと指定して宣言する。
//つまり**は乗算と同じ優先度を持つ。
infix operator **: MultiplicationPrecedence

private extension Coords {
    static func ** (lhs: Coords, rhs: Coords) -> Coords {
        let x = pow(Double(lhs.x), Double(rhs.x))
        let y = pow(Double(lhs.y), Double(rhs.y))
        return Coords(x: Int(x), y: Int(y))
    }
}

func calcByCustomInfixOperator() {
    let a = Coords(x: 2, y: 3)
    let b = Coords(x: 3, y: 2)
    print("Custom infix operator result: \((a ** b).description)")
    let c = Coords(x: -5, y: -3)
    //**は乗算と同じ優先度を持っているので+よりも優先して計算される。
    let result = c + a ** b
    print("Custom operator result considered precedence: \(result.description)")
}
