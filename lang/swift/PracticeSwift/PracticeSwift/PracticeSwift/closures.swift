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
