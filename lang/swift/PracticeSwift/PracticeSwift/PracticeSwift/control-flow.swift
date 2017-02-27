//
//  control-flow.swift
//  PracticeSwift
//
// Control clow practices
//
//  Copyright © 2017年 moguonyanko. All rights reserved.
//

import Foundation

func ignoreIndex() {
    let count = 10
    
    var target = 0
    let value = 2
    
    for _ in 1...count {
        target += value
    }
    
    print(target)
}

//Repeat-While
func repeatAddNumbers() {
    var base = 0
    
    let limit = 10
    let num = 1
    
    repeat {
        base += num
    } while base < limit
    
    print(base)
}

//No Implicit Fallthrough
func checkSwitchCasesWithoutFallthrough() {
    let key = "hey"
    
    switch key {
    case "Hello":
        print("case 1")
    case "hello", "hey":
        print("case 2")
    case "HELLO":
        print("case 3")
    default:
        print("default case")
    }
}

//Interval Matching
func matchCaseByRange() {
    //UInt32型への明示的な型宣言が必要
    let limit: UInt32 = 100
    let n = arc4random_uniform(limit)
    
    var result: String
    
    switch n {
    case 0:
        result = "zero"
    case 1..<10:
        result = "small"
    case 10..<50, 51..<90:
        result = "middle"
    case 50:
        result = "just middle"
    case 90..<100:
        result = "big"
    default:
        result = "any"
    }
    
    print("\(n) is \(result)")
}

//Tuples
func matchCaseByTuple(x: Int, y: Int) {
    let coord = (x, y)
    
    switch coord {
    case (0, 0) :
        print("座標は原点にあります")
    case (_, 0) :
        print("(\(coord.0), 0)はX軸上の座標です")
    case (0, _) :
        print("(0, \(coord.1))はY軸上の座標です")
    case (-10...10, -10...10) :
        print("(\(coord.0), \(coord.1))は矩形の内側にある座標です")
    default :
        print("(\(coord.0), \(coord.1))は矩形の外側にある座標です")
    }
}

//Value Bindings
func bindValueInSwitch(x: Int, y: Int) {
    let point = (x, y)
    
    //caseブロックごとにスコープが生成されているので変数名が引数名と衝突してもエラーにならない。
    //case let (x, 0) のようにタプルの前にletを指定しても同じ結果になる。
    switch point {
    case (let x, 0):
        print("座標はX軸上にあります(X座標値=\(x))")
    case (0, let y):
        print("座標はY軸上にあります(Y座標値=\(y))")
    case let (x, y):
        print("(\(x), \(y))はどの軸上にもありません")
    }
}

//Where
func bindValueByWhere(x: Int, y: Int) {
    let point = (x, y)
    
    //where内ではcase内で宣言された変数もcase外で宣言された変数も参照できる。
    switch point {
    case let (xx, yy) where xx == yy:
        print("(\(xx), \(yy))はx == yの直線上にある座標です")
    case let (xx, yy) where xx == -yy:
        print("(\(xx), \(yy))はx == -yの直線上にある座標です")
    case let (x, y):
        print("(\(x), \(y))はどの直線上にもありません")
    }
}

//Compound Cases
func bindValueInCompoundCases (x: Int, y: Int) {
    let point = (x, y)
    
    //caseに指定する条件は改行してもよい。各条件を区切るカンマはorだと見なせる。
    switch point {
    case (let distance, 0),
         (0, let distance):
        print("軸上の座標であり原点からの距離は \(distance) です")
    default:
        print("座標はどの軸上にもありません")
    }
}


