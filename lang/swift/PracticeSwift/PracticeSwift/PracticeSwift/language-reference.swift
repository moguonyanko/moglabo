//
//  language-reference.swift
//  PracticeSwift
//
//  Language reference practices
//

import Foundation

//Type Identifier
func applyTypeAliases() {
    //BasicInfo型はこの関数内でのみ参照できる。
    typealias BasicInfo = (String, Int)
    let info: BasicInfo = ("foo", 39)
    let getName = { (_ info: BasicInfo) -> String in return info.0 }
    print("User name \"\(getName(info))\" by BasicInfo")
}

//Tuple Type
func matchTupleTypes() {
    var sample = (name: "foo", age: 45)
    sample = ("bar", 32)
    sample = ("baz", age: 33)
    //型がタプルの宣言と一致しなければエラー
    //sample = (28, "hoge")
    //引数名がタプルの宣言と一致しなければエラー
    //sample = (no: 99, code: "???")
    sample = (age: 28, name: "hoge")
    print(sample)
}

//Function Type
private func sampleFunc(name: String, id: Int) -> Bool {
    return false
}

private func sampleFunc2(code: String, no: Int) -> Bool {
    return false
}

//既存の関数と比べてシグネチャに曖昧さが無ければ関数名が衝突してもエラーにならない。
//オーバーロードになっている。
private func sampleFunc2(name: String, id: String) -> Bool {
    return false
}

private func sampleFunc3(name: String, id: Int, checked: Bool) -> Bool {
    return false
}

func matchFunctionType() {
    var fn = sampleFunc
    //型さえ一致していれば引数名が異なっていても代入可能。
    fn = sampleFunc2
    //型が一致しなければ引数名が同じでも代入不可能。
    //引数の数が一致しない場合もエラーになる。
    //fn = sampleFunc3
    print(fn("abc", 123))
}

//Protocol Composition Type
private protocol ProtocolA {
    func execute(number: Int) -> Int
}

private protocol ProtocolB {
    func execute(number: Int) -> Int
}

private class ConformedProtocols: ProtocolA, ProtocolB {
    //2つのprotocolが実装を要求するメソッドのシグネチャがどちらも同じなので
    //1つメソッドを実装するだけで2つのprotocolに従ったことになる。
    func execute(number: Int) -> Int {
        return number
    }
}

private func getMaybeConformedObject() -> AnyObject {
    return ConformedProtocols()
}

func checkComposedProtocolTypes() {
    let obj = getMaybeConformedObject()
    let result = obj is ProtocolA & ProtocolB
    print("Is the class comformed all protocols?: \(result)")
}

//Metatype Type
private class SampleBaseClass {
    class func greet() -> String {
        return "Hello base class"
    }
}

private class SampleSubClass: SampleBaseClass {
    override class func greet() -> String {
        return "こんにちはサブクラス"
    }
}

private final class SampleAnotherSubClass: SampleBaseClass {
    private let name: String
    //staticなメンバ変数は以下のように定義する。class methodから参照できるが
    //init内で初期化することができない。
    //static var name: String = "no name"
    init(name: String) {
        self.name = name
    }
    override class func greet() -> String {
        //instance memberをclass methodから参照することはできない。
        //return "Hey \(name)"
        return "Another sub class"
    }
}

func displayResultWithInheritance() {
    let instance: SampleBaseClass = SampleSubClass()
    print("\(SampleBaseClass.greet())")
    //instance経由でclassメソッドのようなstatic memberを参照することはできない。
    //print("\(instance.greet())")
    //type関数を使い実行時の型を取得してclassメソッドを呼び出す。
    print("\(type(of: instance).greet())")
    //classのselfを参照するとTypeのオブジェクトが得られる。
    let metatype: SampleAnotherSubClass.Type = SampleAnotherSubClass.self
    //AnyObject等ではなくSampleAnotherSubClass型のインスタンスが得られる。
    //呼び出すinitにrequiredが指定されているか，initを定義したclassがfinalでないと
    //コンパイルエラーになる。init呼び出しが失敗しないことを保証せよということかもしれない。
    let instanceByMetatype = metatype.init(name: "foobar")
    print("\(type(of: instanceByMetatype).greet())")
}

//Closure Expression
private func executeCalculation<T>(_ f: (T, T) -> T, _ args: (T, T)) -> T {
    return f(args.0, args.1)
}

private class SampleCaluclator<T> {
    let args: (T, T)
    init(args: (T, T)) {
        self.args = args
    }
    func calc(_ f: (T, T) -> T) -> T {
        return f(args.0, args.1)
    }
    //@autoclosureを付けるだけでもシグネチャが異なると判定される。
    //すなわちオーバーロードされる。
    func calc(_ f: @autoclosure (T, T) -> T) -> T {
        return f(args.0, args.1)
    }
    //オーバーロードの濫用は好ましくないが仕様確認のため。
    func calc(_ f: () -> T) -> T {
        return f()
    }
    func accept(_ f: () -> Void) {
        f()
    }
}

func calcVariousClosure() {
    let args = (1, 2)
    let f = { (x: Int, y: Int) -> Int in x + y }
    print("The sum of \(args) is \(executeCalculation(f, args))")
    
    let calculator = SampleCaluclator(args: (10.5, 2.0))
    var result = calculator.calc { (x: Double, y: Double) -> Double in
        return x * y
    }
    result = calculator.calc { x, y in return x * y }
    result = calculator.calc { return $0 * $1 }
    result = calculator.calc { $0 * $1 }
    print("\(result)")
    
    let calculator2 = SampleCaluclator(args: (50, 1.0))
    print("\(calculator2.calc { $0 + $1 })")
}

//Capture Lists
func runCapturedClosure() {
    var a = 1, b = 4
    let c = SampleCaluclator(args: (a, b))
    let innerFunc = { [a] in a + b }
    let f = { c.calc(innerFunc) }
    //以下のようにcaptureが別のclosure内で行われていると変更の影響を受ける。
    //let f = { c.calc { [a] in a + b } }
    //変数aはinnerFunc内でcaptureされているので変更の影響を受けずに計算が行われる。
    a = 10
    b = 40
    let x = f()
    print("\(x)")
    
    var args = (1, 4)
    let calculator = SampleCaluclator(args: args)
    let delayFunc = { calculator.calc { [args] in args.0 + args.1 } }
    //captureした変数が参照型のオブジェクトを指していた場合は変更の影響を受けてしまう。
    args = (10, 40)
    let z = delayFunc()
    print("\(z)")
    
    //selfを参照するとコンパイルエラーになってしまう。
    calculator.accept {
        print(calculator.args)
    }
    calculator.accept { [weak calculator] in
        print(calculator!.args)
    }
    calculator.accept { [unowned calculator] in
        print(calculator.args)
    }
    calculator.accept { [weak calc = calculator] in
        print(calc!.args)
    }
}

//Type Variable Properties
private class SomeTypeClass {
    class final func bye() {
        print("bye")
    }
    static func hey() {
        print("hey")
    }
    //staticはfinalの効果を包含するのでfinalを共に指定するとコンパイルエラーになる。
    //「static = class + final」と考えてよい。
    //static final func go() {}
}

private class SomeSubTypeClass: SomeTypeClass {
    //class finalやstaticなメソッドはオーバーライドできない。
    //override func bye() {}
    //override func hey() {}
}

func checkTypeVariableProperties() {
    let someType = SomeSubTypeClass.self
    someType.bye()
    someType.hey()
}

//Type Alias Declaration
func declareTypeAliasWithTypeChecking() {
    typealias OnlyStringDict<Key: Hashable> = Dictionary<Key, String>
    var dict: OnlyStringDict = [
        1: "Hello",
        10: "Bye",
        100: "GoodNight"
    ]
    dict[500] = "How are you?"
    //typealiasでString型以外の値を追加できないように宣言しているので以下はエラーとなる。
    //dict[1000] = 5.5
    print(dict.description)
}

//Rethrowing Functions and Methods
private enum MyError: Error {
    case someError
    case anyError
    case subError
    case replacedError
}

private protocol MyThrowable {
    func doThrow(fn: () throws -> Void) throws
}

private func throwUnrelatedError() throws {
    throw MyError.anyError
}

private class SampleThrowableClass {
    //rethrowsを指定した関数はthrowsな関数を引数に取らなければならない。
    //rethrowsを使えばコールバック関数に起因する例外のみを伝搬できるようになる。
    func challenge(callback: () throws -> Void) rethrows {
        do {
            try callback()
            //rethrowsな関数内では引数のthrowsな関数以外によるtryは許されない。
            //関数宣言のrethrowsをthrowsにすると以下のコードは有効になる。
            //try throwUnrelatedError()
        } catch {
            throw MyError.replacedError
        }
    }
    func throwError(_ f: () throws -> Void) throws {
        throw MyError.someError
    }
}

private class SampleSubThrowableClass: SampleThrowableClass, MyThrowable {
    //super classにおいてrethrowsとして宣言されていたメソッドを
    //throwsに書き換えてオーバーライドしようとしてもエラーとなる。
    //override func challenge(callback: () throws -> Void) throws {
    //    try! callback()
    //    throw MyError.subError
    //}
    
    //throwsと宣言されたsuper classやprotocolのメソッドを
    //rethrowsに変えて実装するのは問題無い。
    override func throwError(_ f: () throws -> Void) rethrows {
        try f()
    }
    func doThrow(fn: () throws -> Void) rethrows {
        try fn()
    }
}

func checkThrowableClassBehavior() {
    let sub = SampleSubThrowableClass()
    
    do {
        try sub.challenge {
            throw MyError.someError
        }
        try sub.doThrow {
            throw MyError.subError
        }
        print("not occured error")
    } catch {
        print("catched error")
    }
}

//Enumerations with Cases of Any Type
private enum EnumClassifer {
    //rawValueを指定する場合は各enumに引数の型を指定することができない。
    //case string(String) = "string"
    case string(String), integer(Int), double(Double)
}

func collectValuesByEnum() {
    let strf = EnumClassifer.string,
        intf = EnumClassifer.integer,
        dblf = EnumClassifer.double
    var results = [EnumClassifer]()
    let samples: [Any] = ["hoge", 1, 3.5]
    samples.forEach {
        switch $0 {
        case let value as String:
            results.append(strf(value))
        case let value as Int:
            results.append(intf(value))
        case let value as Double:
            results.append(dblf(value))
        default:
            print("unknown value")
        }
    }
    print("\(samples.description) -> \(results.description)")
}

//Precedence Group Declaration
precedencegroup MyOperationPrecedence {
    //*よりも優先度が低く+よりも優先度が高い演算子を定義する。
    higherThan: AdditionPrecedence
    lowerThan: MultiplicationPrecedence
    //x - y - z のように演算子が連なった時どちら側から計算するかを指定する。
    associativity: right
    //assignmentはoptional chainingで演算子が使われた時の振る舞いに影響する。
    assignment: true
}

//(, ), #, @ など演算子以外の用途で言語に予約されている文字を
//カスタム演算子宣言で用いることはできない。+, -, *, / は使用できるが
//文字の並びによってはコンパイルエラーとなる。
//アルファベットは使用できない。
infix operator /-|^+~|-*: MyOperationPrecedence

private extension Int {
    static func /-|^+~|-*(lhs: Int, rhs: Int) -> Int {
        let value = abs(lhs - rhs) * 10
        return value
    }
}

func checkCustomPrecedenceGroup() {
    let x = 1 + 2 /-|^+~|-* 3 * 10
    print(x)
    
    //associativityがrightと指定されているのでカスタム演算子 /-|^+~|-* は右から評価される。
    //つまり以下の式は 20 /-|^+~|-* (10 /-|^+~|-* 5) と指定されたものと同じ。
    let y = 20 /-|^+~|-* 10 /-|^+~|-* 5
    print(y)
    
    let a: Int? = 10
    let b: Int? = 20
    let c: Int? = 30
    let z = a! /-|^+~|-* b! /-|^+~|-* c!
    print(z)
}

//Optional Pattern
func pickupOnlyNonNilValues() {
    let values: [Any?] = [nil, "foo", 123, 1.5, nil]
    //nilはループ内で評価されない。
    for case let value? in values {
        print(value)
    }
    //上のコードは下のコードと同じ振る舞いをする。しかし上のコードではループ内に来た時点で
    //valueがnilでないことが保証されているため，??を使ってデフォルト値を指定する必要が無い。
    for value in values {
        if value != nil {
            print(value ?? "none")
        }
    }
}
