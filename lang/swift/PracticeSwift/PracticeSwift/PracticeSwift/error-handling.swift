//
//  error-handling.swift
//  PracticeSwift
//
//  Error Handling Practices
//

import Foundation

//Representing and Throwing Errors
private enum MyError: Error {
    case invalidAccess
}

//throwsを指定すると関数を呼び出した側はエラーハンドリングを強制される。
//throwsを指定していない関数でエラーをスローすることはできない。
private func canMyError(occurError: Bool) throws -> String {
    if occurError {
        throw MyError.invalidAccess
    }
    
    return "OK"
}

//Handling Errors
func checkMyError() {
    let occurError = true
    
    do {
        //catchを使ってエラーハンドリングを行わなければコンパイルエラーになる。
        let result = try canMyError(occurError: occurError)
        print("Returned \(result).")
    } catch MyError.invalidAccess {
        //catchでエラーのパターンマッチングが行われる。
        //エラーをenumで定義するのはそのためではないだろうか。
        print("Catched my error invalid access.")
    } catch {
        //特定のcaseを指定しないcatchブロックが無いとコンパイルエラー。
        print("Catched unknown error.")
    }
}

//エラーは基本的に「チェック例外」のようなものである。
//throwsを指定された関数を呼び出した場合，エラーハンドリングを強制される。
//ただしどのようなコードでハンドリングするのかはプログラマに委ねられる。
//try，try?，try!のどれを使うかによってエラーハンドリングは変わってくる。

//Converting Errors to Optional Values
func convertErrorToOptionalalue() {
    let result = try? canMyError(occurError: true)
    print("Convert error to optional value: \(result?.description ?? "converted")")
}

//Disabling Error Propagation
func notPropagateError() {
    //occurErrorをtrueにした場合，resultに値が設定されないので実行時エラーになる。
    let result = try! canMyError(occurError: false)
    print("Disabled error propagation: \(result.description)")
}






