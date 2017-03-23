//
//  collection-types.swift
//  PracticeSwift
//
//  Collection types practices
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
    
    if let ele = s.remove(x) {
        print("Removed \(ele)")
    } else {
        print("Removed nothing")
    }
    
    print("Is contain \(x) in set: \(s.contains(x))")
    
    //Setの要素の順序は初期化時に与えた順序と一致しないがソートすることはできる。
    print(s)
    print(s.sorted())
}

//Fundamental Set Operations
func operateSets() {
    let s1: Set = [2, 4, 6, 8, 10]
    let s2: Set = [4, 8, 12, 16, 20]
    
    let unionedSet = s1.union(s2).sorted()
    print(unionedSet)
    
    let intersectedSet = s1.intersection(s2).sorted()
    print(intersectedSet)
    
    let subtractedSet = s1.subtracting(s2).sorted()
    print(subtractedSet)
    
    let symmetricDiffSet = s1.symmetricDifference(s2).sorted()
    print(symmetricDiffSet)
}

//Set Membership and Equality
func checkMemberOfSets() {
    let s1: Set = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let s2: Set = [2, 4, 6, 8, 10]
    let s3: Set = [3, 6, 9]
    let s4: Set = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    
    let isSuper = s1.isSuperset(of: s2)
    print(isSuper)
    
    let isStrictSuper = s1.isStrictSuperset(of: s2)
    print(isStrictSuper)
    
    let isSub = s2.isSubset(of: s1)
    print(isSub)
    
    let isStrictSub = s2.isStrictSubset(of: s1)
    print(isStrictSub)
    
    let isDisjoint = s2.isDisjoint(with: s3)
    print(isDisjoint)
    
    //isStrictXXでは含んでいる要素が比較元と全く等しいSetを認めない。
    //つまり==演算子の結果とは逆の結果を返す。
    
    let isStrictSuper2 = s1.isStrictSuperset(of: s4)
    print(isStrictSuper2)
    
    let isStrictSub2 = s4.isStrictSubset(of: s1)
    print(isStrictSub2)
    
    //Setの比較で順序は考慮されない。
    print(s1 == s4)
}

//Creating a Dictionary with a Dictionary Literal
func createDictionaryWithDefaultValues() {
    //キーと値のペアの順序はDictionay宣言時の順序とは関係無い。
    let dict = [10: "foo", 20: "bar", 30: "baz"]
    print(dict)
}

//Accessing and Modifying a Dictionay
func modifyDictionay() {
    //letで宣言するとペアを一切変更できなくなる。
    var dict: [String: Int] = [:]
    
    if dict.isEmpty {
        dict["goma"] = 1
        dict["mike"] = 100
    }
    
    dict["poko"] = 200
    
    dict["mike"] = 300
    
    print(dict)
    
    if let oldValue = dict.updateValue(1000, forKey: "mike") {
        print("Replaced old value \(oldValue)")
    }
    
    let key = "poo"
    if let value = dict[key] {
        print("value = \(value)")
    } else {
        print("No value binded \"\(key)\"")
    }
    
    dict["poko"] = nil

    let rmKey = "mike"
    if let oldValue = dict.removeValue(forKey: rmKey) {
        print("Removed value \(oldValue)")
    } else {
        print("No value is contained binding \(rmKey) in this dictionary")
    }
    
    print(dict)
}

//Iterating Over a Dictionary
func iterateMapPairs() {
    let tests = ["foo": 100, "bar": 70, "baz": 85]
    
    for (name, score) in tests {
        print("\(name) score = \(score)")
    }
    
    let names = [String](tests.keys)
    let scores = [Int](tests.values)
    
    print(names.sorted())
    print(scores.sorted())
}




