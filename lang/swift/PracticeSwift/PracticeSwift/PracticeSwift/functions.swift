//
//  functions.swift
//  PracticeSwift
//
//  Functions practices
//

import Foundation

//Functions With Multiple Parameters
private func addTwoNumbers(num1: Int, num2: Int) -> Int {
    return num1 + num2
}

private func divTwoNumbers(num1: Int, num2: Int) -> Int {
    return num1 - num2
}

//Bool型の変数にnilを割り当てることはできない。
//即ち以下の関数を displayReturnValue(nil) のように呼び出すことはできない。
func displayReturnValue(adding: Bool) {
    let num1 = 10, num2 = 20
    
    var result: Int
    
    if adding {
        result = addTwoNumbers(num1: num1, num2: num2)
    } else {
        result = divTwoNumbers(num1: num1, num2: num2)
    }
    
    print("Result = \(result)")
}

func ignoreReturnValue() {
    let _ = addTwoNumbers(num1: 2, num2: 3)
    //_を変数のように参照するとエラーになる。
    print("Ignored return value")
}

//Functions with Multiple Return Values
private func classifyEvenAndOdd(values: [Int]) -> (even: [Int], odd: [Int]) {
    //letで宣言すると要素の追加も不可能。
    var evens: [Int] = [], odds: [Int] = []
    
    for value in values[1..<values.count] {
        if value % 2 == 0 {
            evens.append(value)
        } else {
            odds.append(value)
        }
    }
    
    return (evens, odds)
}

func printMultipleReturnValues() {
    let values = [3, 92, 51, 5, 67, 54, 22, 2, 8, 9, 1, 19, 56, 77]
    
    let results = classifyEvenAndOdd(values: values)
    
    print("Even = \(results.even)")
    print("Odd = \(results.odd)")
}

//Optional Tuple Return Types
private func optionalClassifyEvenAndOdd(values: [Int]) -> (even: [Int], odd: [Int])? {
    //戻り値がOptionalでなければnilを返そうとした時点でコンパイルエラーになる。
    if values.isEmpty {
        return nil
    }
    
    return classifyEvenAndOdd(values: values)
}

func printOptionalValues() {
    let values: [Int] = []
    
    let results = optionalClassifyEvenAndOdd(values: values)
    
    print("Even? = \(results?.even)")
    print("Odd? = \(results?.odd)")
}

//Specifyng Argumenty Labels
func specifyngArgumentFunction(greeting normalArg: String, name: String) {
    let s1 = "\(normalArg), \(name)."
    //引数の別名は関数内部で参照するとエラーになる。
    //let s2 = "\(greeting), \(name)"
    print(s1)
}

//Omitting Argument Labels
//引数名の前に _ を付けた場合，呼び出し側は引数名を「付けずに」関数を呼ばなければならない。
//引数名を付けてしまうとエラーになる。省略というより「引数名なし」だと考えた方がいいかもしれない。
func omitArgumentLabel(_ greeting: String, _ name: String) {
    print("\(greeting), \(name).")
}

//Default Parameter Values
func addFunctionWithDefaultParameters(param1: Int = 10, param2: Int = 20) {
    print(param1 + param2)
}

//Variadic Parameters
//Int...型の引数は関数内部では[Int]型の値として扱うことができるが，
//関数を呼び出す際にInt...型の引数として[Int]型の値を渡すことはできない。
private func getCenterNumber(_ numbers: Int...) -> Int {
    let nums = numbers.sorted()
    
    //Int型の値を除算して浮動小数点数が得られてもInt型の値になるように小数点以下は切り捨てられる。
    //「割られる数」の型が自動的に維持される。round関数などで丸める必要は無い。
    let centerIndex = nums.count / 2
    
    return nums[centerIndex];
}

func printCenterNumber() {
    let center = getCenterNumber(4, 2, 5, 3, 0, 7, 1, 8, 9, 10)
    print("Center number = \(center)")
}

//In-Out Parameters
private func swapString(s1: inout String, s2: inout String) {
    let temp = s1
    //inoutが無いと引数の値を変更しようとした時点でエラー
    s1 = s2
    s2 = temp
}

func swapGreeting() {
    var g1 = "Hello"
    var g2 = "こんにちは"
    print("before swap: \(g1) - \(g2)")
    
    //関数の引数がinoutで宣言されていなければ&を付けることができない。
    swapString(s1: &g1, s2: &g2)
    
    print("after swap: \(g1) - \(g2)")
}

//Using Function Type
private func addAllInts(_ values: [Int]) -> Int {
    var result = 0
    
    for v in values {
        result += v
    }
    
    return result
}

func runFunctionType() {
    let f: ([Int]) -> Int = addAllInts
    
    let result = f(Array(1...10))
    
    print("addAllInts result = \(result)")
}

//Function Types as Parameter Types
private func addAllIntsInRange(start: Int, end: Int,
                              _ addFunc: ([Int]) -> Int) -> Int {
    let values = Array(start...end)
    let result = addFunc(values)
    
    return result
}

func runFunctionTypeInRange() {
    let result = addAllIntsInRange(start: 1, end: 10, addAllInts)
    print("addAllIntsInRange result = \(result)")
}

//Function Types as Return Types
private func greetHelloEn (_ name: String) -> String {
    return "Hello, \(name)!"
}

private func greetHelloJa (_ name: String) -> String {
    return "こんにちは、\(name)!"
}

private func chooseGreetFunction(code: String) -> (String) -> String {
    let dict = [
        "en": greetHelloEn,
        "ja": greetHelloJa
    ]
    
    //guard内でもネストされた関数を宣言できる。
    guard let f = dict[code] else {
        func defaultFunc(_ name: String) -> String {
            //ネストされた関数外の変数も参照できる。
            let result = "Sorry \(name), \(code) is unsupported."
            return result
        }
        return defaultFunc
    }
    
    return f
}

func chooseTargetFunction() {
    let name = "Taro"
    
    let f1 = chooseGreetFunction(code: "en")
    let f2 = chooseGreetFunction(code: "ja")
    let f3 = chooseGreetFunction(code: "de")
    
    print(f1(name))
    print(f2(name))
    print(f3(name))
}
