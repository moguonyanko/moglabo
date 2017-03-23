//
//  basic-operators.swift
//  PracticeSwift
//  
//  Basic operators practices
//

import Foundation

//Assignment Operator
func assignTwoVariables() {
    let (x, y) = (100, 200)
    
    print(x, y)
}

//Comparison Operators
func compareTuples() {
    let x = (1, "apple") > (2, "banana")
    let y = (100, "taro") < (50, "jiro")
    let z = (true, 300) == (false, 300)
    
    print(x, y, z)
}

//Nil-Coalescing Operator
func coalesceNil() {
    let defaultFavorite = "orange"
    var requestFavorite: String?
    
    var favorite = requestFavorite ?? defaultFavorite
    
    print(favorite)
    
    requestFavorite = "apple"
    favorite = requestFavorite ?? defaultFavorite
    
    print(favorite)
}

//Range Operators
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
