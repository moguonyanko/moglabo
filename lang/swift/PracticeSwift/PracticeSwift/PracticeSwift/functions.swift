//
//  functions.swift
//  PracticeSwift
//
//  Functions practices
//
//  Copyright © 2017年 moguonyanko All rights reserved.
//

import Foundation

//Functions With Multiple Parameters
private func addTwoNumbers(num1: Int, num2: Int) -> Int {
    return num1 + num2
}

private func divTwoNumbers(num1: Int, num2: Int) -> Int {
    return num1 - num2
}

//Bool型の変数にnilを割り当てることはできない。
//即ち以下の関数を displayReturnValue(nil) のように呼び出すことはできない。
func displayReturnValue(adding: Bool) {
    let num1 = 10, num2 = 20
    
    var result: Int
    
    if adding {
        result = addTwoNumbers(num1: num1, num2: num2)
    } else {
        result = divTwoNumbers(num1: num1, num2: num2)
    }
    
    print("Result = \(result)")
}

func ignoreReturnValue() {
    let _ = addTwoNumbers(num1: 2, num2: 3)
    //_を変数のように参照するとエラーになる。
    print("Ignored return value")
}

//Functions with Multiple Return Values
private func classifyEvenAndOdd(values: [Int]) -> (even: [Int], odd: [Int]) {
    //letで宣言すると要素の追加も不可能。
    var evens: [Int] = [], odds: [Int] = []
    
    for value in values[1..<values.count] {
        if value % 2 == 0 {
            evens.append(value)
        } else {
            odds.append(value)
        }
    }
    
    return (evens, odds)
}

func printMultipleReturnValues() {
    let values = [3, 92, 51, 5, 67, 54, 22, 2, 8, 9, 1, 19, 56, 77]
    
    let results = classifyEvenAndOdd(values: values)
    
    print("Even = \(results.even)")
    print("Odd = \(results.odd)")
}

//Optional Tuple Return Types




