//
//  collection-types.swift
//  PracticeSwift
//
//  Collection types practices
//
//  Created by moguonyanko on 2017/01/30.
//

import Foundation

//Creating an Array with a Default Value
func createArrayWithDefaultValue() {
    let a = Array(repeating: "no name", count: 5)
    print(a)
}

//Creating an Array by Adding Two Arrays Together
func combineArrays() {
    let a = Array(repeating: 1.0, count: 5)
    //精度が上がる方向への型変換も暗黙には行われない。
    //従ってa + b1はコンパイルエラーになる。
    //let b1 = [1, 2, 3, 4, 5]
    let b2 = [1.0, 2.0, 3.0, 4.0, 5.0]
    
    let ab = a + b2
    print(ab)
    
    let c = Array(repeating: "null", count: 5)
    let d = ["hoge", "fuga"]
    
    //要素の型が異なる配列を結合しようとするとコンパイルエラー
    //let ac = a + c
    let cd = c + d
    print(cd)
}

//Accessing and Modifyng an Array
func modifyArrayElements() {
    var a: [String] = []
    
    a.append("hogehoge")
    a += ["foo", "bar", "baz", "fuga", "poo"]
    a[0] = "goma"
    a[2...5] = ["orange", "apple", "banana"]
    //自動で配列のサイズが拡張されたりはしない。
    //a[10...12] = ["java", "swift"]
    a.insert("poko", at: 0)
    a.remove(at: a.endIndex - 1)
    a.removeLast()
    
    print(a)
}

//Iterating Over an Array
func iterateArrayElements() {
    let src = ["apple", "banana", "orange"]
    
    for element in src {
        print(element)
    }
    
    for (index, value) in src.enumerated() {
        print("index = \(index), value = \(value)")
    }
}

//Creating a Set with an Array Literal
func createSetWithDefaultArray() {
    var s1 = Set<String>()
    //Set.insertは副作用がある。s1がletで宣言されているとコンパイルエラー。
    s1.insert("banana")
    
    let s2: Set = ["orange", "apple", "lemon"]
    
    //Set.unionに副作用はない。
    let s3 = s1.union(s2)
    
    print(s3)
}

//Accessing and Modifying a Set
func removeElementOfSet() {
    let x = 4.5
    //xの型に合わせてSetの各要素に対し暗黙の型変換が行われる。
    //その結果sの型はSet<Double>になる。
    var s: Set = [1, 2, 3, x, 5]
    s.insert(10)
    //型変換が行われ3.0が削除される。Set.removeは副作用があるが削除した要素かnilを返す。
    s.remove(3)
    
    //Setの要素の順序は初期化時に与えた順序と一致しない。
    print(s)
    
    if let ele = s.remove(x) {
        print("Removed \(ele)")
    } else {
        print("Removed nothing")
    }
    
    print("Is contain \(x) in set: \(s.contains(x))")
    
}







