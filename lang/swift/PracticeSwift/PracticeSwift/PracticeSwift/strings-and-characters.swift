//
//  strings-and-characters.swift
//  PracticeSwift
//
//  Strings and characters practices
//
//  Created by moguonyanko on 2017/01/26.
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
