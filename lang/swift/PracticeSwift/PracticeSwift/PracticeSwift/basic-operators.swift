//
//  basic-operators.swift
//  PracticeSwift
//  
//  Basic operators practices
//
//  Created by Kouichi Yamada on 2017/01/26.
//  Copyright © 2017年 Kouichi Yamada. All rights reserved.
//

import Foundation

func assignTwoVariables() {
    let (x, y) = (100, 200)
    
    print(x, y)
}

func compareTuples() {
    let x = (1, "apple") > (2, "banana")
    let y = (100, "taro") < (50, "jiro")
    let z = (true, 300) == (false, 300)
    
    print(x, y, z)
}

func coalesceNil() {
    let defaultFavorite = "orange"
    var requestFavorite: String?
    
    var favorite = requestFavorite ?? defaultFavorite
    
    print(favorite)
    
    requestFavorite = "apple"
    favorite = requestFavorite ?? defaultFavorite
    
    print(favorite)
}

func iterateRanges() {
    for index in 0...3 {
        print("Now index is \(index)")
    }
    
    let fruits = ["apple", "lemon", "orange", "banana", "kiwi"]
    let size = fruits.count
    
    for index in 0..<size {
        print("No.\(index) fruit is \(fruits[index])")
    }
}


