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


