//
//  strings-and-characters.swift
//  PracticeSwift
//
//  Strings and characters practices
//

import Foundation

//Working with Characters
func charactersToString() {
    let chars: [Character] = ["G", "F", "C", "S"]
    let str = String(chars)
    
    print(str)
}

//String Indices
func catStringByIndex() {
    let src = "Gun_Fire_Control_System"
    
    let s1 = src[src.startIndex]
    let s2 = src[src.index(before: src.endIndex)]
    let s3 = src[src.index(after: src.startIndex)]
    let index = src.index(src.startIndex, offsetBy: 3)
    let s4 = src[index]
    
    print(s1, s2, s3, s4)
}

//Inserting and Removing
func mutateStringValue() {
    //varで宣言すれば文字列でも可変になる。
    var mutableStr = "Mutable WELCOME"
    let s = "!!!"
    
    mutableStr.insert(contentsOf:s.characters, at: mutableStr.index(before: mutableStr.endIndex))
    
    print(mutableStr)
    
    let range = mutableStr.index(mutableStr.endIndex, offsetBy: -s.characters.count)..<mutableStr.endIndex
    mutableStr.removeSubrange(range)
    
    print(mutableStr)
    
    //不変な値に対し副作用のあるメソッドを呼び出した時点でコンパイルエラーになる。
    //let immutableStr = "Immutable WELCOME"
    //immutableStr.remove(at: immutableStr.index(before: immutableStr.endIndex))
}

//Unicode Representations of Strings
func dumpUnicodeCodes() {
    let src = "Hello,こんにちは😉";
    
    for codeUnit in src.utf8 {
        print("\(codeUnit)", terminator: " ")
    }
    
    print("")
    
    for codeUnit in src.utf16 {
        print("\(codeUnit)", terminator: " ")
    }
    
    print("")
    
    for scalar in src.unicodeScalars {
        print("\(scalar)=\(scalar.value)", terminator: " ")
    }
    
    print("")
}

private func makeMultilineStringLiteral1() -> String {
    let s = """
Hello world.
Java
JavaScript
Swift
"""
    return s
}

private func makeMultilineStringLiteral2() -> String {
    let s = """
    Hello world.
        Java
    JavaScript
    Swift
"""
    return s
}

// multiline内の改行もスペースも全て反映される。
private func makeMultilineStringLiteral3() -> String {
    let s = """

Hello world."abcdefg
    hijklmn"
Java
JavaScript
Swift

"""
    return s
}

func displayMultilineStringLiterals() {
    print("\(makeMultilineStringLiteral1())")
    print("\(makeMultilineStringLiteral2())")
    print("\(makeMultilineStringLiteral3())")
}
