//
//  closures.swift
//  PracticeSwift
//
//  Closures practices
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
private func makeMultiplyer(forMultiply amount: Int) -> () -> Int {
    var value = 1
    
    //ネストされた関数にprivateを付けられない。
    func multiply() -> Int {
        value *= amount
        return value
    }
    
    return multiply
}

func calcWithCapturingValue() {
    let multiBy2 = makeMultiplyer(forMultiply: 2)
    
    print("\(multiBy2())")
    print("\(multiBy2())")
    print("\(multiBy2())")
    
    let multiBy3 = makeMultiplyer(forMultiply: 3)
    
    print("\(multiBy3())")
    print("\(multiBy3())")
    print("\(multiBy3())")
}

//Escaping Closures
private var escapingHandlers: [() -> Void] = []

private func appendEscapeClosure(handler: @escaping () -> Void) {
    //@escapingが無いと以下のコードはコンパイルエラーになる。
    //関数を引数に取る関数が評価された後に引数の関数を評価したければ@escapingする必要がある。
    escapingHandlers.append(handler)
}

private func doSomethingWithNonEscapingHandler(closure: () -> Void) {
    closure()
}

private class EscapingSample {
    var foo = "FOO"
    
    func doSomething() {
        appendEscapeClosure {
            //@escapingが指定された関数がクラス内のプロパティを参照するときは
            //明示的にselfを記述する必要がある。
            self.foo = "ESCAPED!"
        }
        
        doSomethingWithNonEscapingHandler {
            foo += "BAR"
        }
    }
}

func runEscapingFunction () {
    let sample = EscapingSample()
    sample.doSomething()
    print("foo value before escaping = \(sample.foo)")
    
    let escapingFunc = escapingHandlers.first
    //関数は存在しないかもしれないので?を付ける。何も書かないとコンパイルエラー。
    escapingFunc?()
    print("foo value after escaping = \(sample.foo)")
}

//Autoclosures










