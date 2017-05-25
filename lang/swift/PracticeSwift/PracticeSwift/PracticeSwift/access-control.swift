//
//  access-control.swift
//  PracticeSwift
//
//  Access Control Practices
//

import Foundation

//アクセスレベル修飾子を付けない場合はinternalになる。
//internalであれば同じモジュール内から自由にアクセスできる。
//fileprivateより緩いアクセスレベルになる。
fileprivate class SampleFileprivateClass {
    //SampleInternalClassはfileprivateなのでこのファイル外から参照することができない。
    //一方でよりアクセスレベルが緩いメソッドをクラス内に定義することはできる。
    internal func execute() {
        print("Hello internal class")
    }
}

//この関数は暗黙でinternalになっている。
func displayInternalAccessControlResult() {
    SampleFileprivateClass().execute()
}

//Custom Types
public struct SamplePublicStructure {
    //publicなstructureのプロパティでもpublicにするには明示的に指定する必要がある。
    public var number: Int
    //以下のプロパティはinternalになる。暗黙でpublicにはならない。
    var name: String
}

fileprivate struct SampleFileprivateStructure {
    //暗黙でfileprivateになる。
    var name: String
}

private struct SamplePrivateStructure {
    //暗黙でprivateになる。
    //アクセスレベル修飾子を指定しなかった場合，プロパティやメソッドを含むclassやstructure，
    //enumのアクセスレベル修飾子を引き継ぐということである。ただしpublicは除く。
    var name: String
}

internal func displayAccessLevelSamples() {
    let a = SamplePublicStructure(number: 100, name: "hoge")
    let b = SampleFileprivateStructure(name: "fuga")
    let c = SamplePrivateStructure(name: "no name")
    print("\(a.name),\(b.name),\(c.name)")
}

//Tuple Types
private let samplePrivateValue = "PRIVATE VALUE"
internal let sampleInternalValue = "INTERNAL VALUE"

func checkTupleAccessLevel() {
    //tupleのアクセスレベルはより厳しい方に合わせられる。
    //tuple単体で定義されることが無いのでそのアクセスレベルを明示することはできない。
    print("\((samplePrivateValue, sampleInternalValue))")
}

//Function Types
class MyInternalClass {
    var name = "My internal class"
}

private class MyPrivateClass {
    var name = "My private class"
}

//private classのインスタンスを戻り値に含んでいるので関数のアクセスレベルは
//privateかfileprivateにしないとコンパイルエラーになる。tupleがfileprivateな
//インスタンスを含んでいる場合も同じである。
private func getAccessLeveledTuple() -> (MyInternalClass, MyPrivateClass) {
    return (MyInternalClass(), MyPrivateClass())
}

func callGetterAccessLeveledTuple() {
    let tuple = getAccessLeveledTuple()
    print("\(tuple.0.name), \(tuple.1.name)")
}

//Enumeration Types
//enumの各caseはenumのアクセスレベルに従う。以下の例では全てpublicとなる。
public enum PublicDirection {
    case top, bottom, left, right
}

func checkEnumAccessLevel() {
    print("\(PublicDirection.top), \(PublicDirection.bottom)")
}

private let myEnumRawValue1 = "My enum raw value 1"

private enum AccessLevelSampleEnum: String {
    //各caseはenumのアクセスレベルより厳しいレベルを指定することができない。
    //しかしraw valueにはリテラルを指定しなければならないので確認しようがない。
    case v1 = "hoge"
    //case v2 = myEnumRawValue1
}

//Nested Types
private class EnclosingPrivateClass {
    var name = "Enclosing private class"
    //private classにネストされたclassだが暗黙でprivateにはならない。
    //Language Guideの「Nested Types」で記されている内容とは異なる振る舞いに思える。
    class NestedClass {
        var name = "Nested class"
    }
}

func accessPrivateNestedClass() {
    let enclosing = EnclosingPrivateClass()
    let nested = EnclosingPrivateClass.NestedClass()
    print("\(enclosing.name) and \(nested.name)")
}

//Subclassing
internal class InternalSuperClass {
    fileprivate func operate() {
        print("internal super")
    }
}

//sub classにsuper classよりも高いアクセスレベルを指定しても問題無い。
private class PrivateSubClass: InternalSuperClass {
    //オーバーライドされるsuper classのメソッドより低いアクセスレベルを指定することはできるが
    //より高いアクセスレベル(ここではprivate)を指定することはできない。
    override internal func operate() {
        print("private sub")
    }
}

public class PublicSuperClass {
    fileprivate func operate() {
        print("public super")
    }
}

fileprivate class FileprivateSubClass: PublicSuperClass {
    //オーバーライド元がprivateだった場合はアクセスできないのでオーバーライドできない。
    override public func operate() {
        //オーバーライド元のメソッドがより高いアクセスレベルを指定されていたとしても
        //アクセスできるなら呼び出せる。
        super.operate()
        print("... and file private sub")
    }
}

func checkSubclassingAccessLevelResults() {
    let sample1 = PrivateSubClass()
    sample1.operate()
    let sample2 = FileprivateSubClass()
    sample2.operate()
}

//Constants, Variables, Properties, and Subscripts
//private classのインスタンスをpublicな変数として宣言することはできない。
//public var privateObject = PrivateSubClass()

//Getters and Setters













