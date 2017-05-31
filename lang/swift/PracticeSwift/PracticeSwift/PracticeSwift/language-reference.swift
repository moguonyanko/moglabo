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


