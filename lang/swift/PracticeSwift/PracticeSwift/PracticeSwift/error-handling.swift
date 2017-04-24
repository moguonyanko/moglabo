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

//throwsを指定するとエラーハンドリングを強制することができる。
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
        print("Catched my error invalid access.")
    } catch {
        //特定のcaseを指定しないcatchブロックが無いとコンパイルエラー。
        print("Catched unknown error.")
    }
}


