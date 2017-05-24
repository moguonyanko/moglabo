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
fileprivate class SampleInternalClass {
    //SampleInternalClassはfileprivateなのでこのファイル外から参照することができない。
    //一方でよりアクセスレベルが緩いメソッドをクラス内に定義することはできる。
    internal func execute() {
        print("Hello internal class")
    }
}

//この関数は暗黙でinternalになっている。
func displayInternalAccessControlResult() {
    SampleInternalClass().execute()
}

//Custom Types
