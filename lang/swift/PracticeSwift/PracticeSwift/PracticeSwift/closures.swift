//
//  closures.swift
//  PracticeSwift
//
//  Closures practices
//
//  Copyright © 2017年 moguonyanko All rights reserved.
//

import Foundation

//Closure Expression Syntax
private func sortedNames(_ names: [String]) -> [String] {
    return names.sorted(by: { (n1: String, n2: String) -> Bool in
        //文字列を昇順で並び替える。
        return n1 < n2
    })
}

func sortedByClosure() {
    let names = ["foo", "bar", "baz", "hoge", "fuga"]
    
    let result = sortedNames(names)
    
    print("\(names) -> \(result)")
}

func anotherViewSortedNames(names: [String]) {
    var result: [String];
    
    result = names.sorted(by: {(n1: String, n2: String) -> Bool in return n1 > n2})
    
    print("\(names) -> \(result)")
    
    result = names.sorted(by: {n1, n2 in return n1 > n2})
    
    print("Inferring Type From Context:\(names) -> \(result)")
    
    result = names.sorted(by: { n1, n2 in n1 > n2 })
    
    print("Implicit Returns from Single-Expression Closures:\(names) -> \(result)")
    
    result = names.sorted(by: { $0 > $1 })
    
    print("Shorthand Argument Names:\(names) -> \(result)")
    
    result = names.sorted(by: >)
    
    print("Operator Method:\(names) -> \(result)")
}

func translateNumbers() {
    let numbers = [0, 1, 2, 3, 4, 100, 5, 6, 7, 8, 9]
    
    let dict = [
        0: "Zero", 1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
        6: "Six", 7: "Seven", 8:"Eight", 9:"Nine", 10:"Ten"
    ]
    
    let result = numbers.map { number -> String in
        guard let s = dict[number] else {
            return "Unknown"
        }
        
        return s
    }
    
    print(result)
}

//Capturing Values









