//
//  decorator.swift
//  DesignPattern
//
//

import Foundation

private let codeTable = [
    "A": "@",
    "B": "~",
    "C": "|",
    "D": "#",
    "E": "$"
]

private protocol CodeReader {
    func read() -> String
}

private class RawCodeReader: CodeReader {
    private let source: String
    init(_ source: String) {
        self.source = source
    }
    func read() -> String {
        return source
    }
}

private class CryptedCodeReader: CodeReader {
    private let reader: CodeReader
    init(_ reader: CodeReader) {
        self.reader = reader
    }
    func read() -> String {
        let charctors = reader.read().characters
        var strs = [String]()
        for char in charctors {
            let keyStr = String(char)
            if let str = codeTable[keyStr] {
                strs.append(str)
            } else {
                strs.append("?")
            }
        }
        return strs.joined()
    }
}

private func runAllCases() {
    let source = "ABCXABCXABCDE"
    let reader = CryptedCodeReader(RawCodeReader(source))
    let text = reader.read()
    print("\(source) -> \(text)")
}

struct Decorator {
    static func main() {
        runAllCases()
    }
}
