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

private class User {
    private let userId: String
    private let password: String
    init(userId: String, password: String) {
        self.userId = userId
        self.password = password
    }
    func equalUser(anotherUser user: User) -> Bool {
        return userId == user.userId && password == user.password
    }
    var name: String {
        return userId
    }
}

private struct Data {
    var name: String
    var owner: User
    var broken: Bool
    var description: String {
        return "This is \"\(name)\" data."
    }
}

private enum DataHandlingError: Error {
    case missingData
    case brokenData
    case notAuthenticaton(ownerName: String)
}

private func createSampleDatas() -> [String:Data] {
    let foo = User(userId: "foo", password: "111"),
        bar = User(userId: "bar", password: "222"),
        baz = User(userId: "baz", password: "333")
    
    let datas = [
        "food": Data(name: "food", owner: foo, broken: false),
        "calculation": Data(name: "calculation", owner: bar, broken: false),
        "demo": Data(name: "demo", owner: baz, broken: false)
    ]
    
    return datas
}

private class DataHandler {
    private var datas: [String:Data]
    //引数を取るinitを定義すると暗黙の引数無しinitは定義されない。
    init(datas: [String:Data]) {
        self.datas = datas
    }
    func getData(dataName: String, user: User) throws -> Data {
        guard let data = datas[dataName] else {
            throw DataHandlingError.missingData
        }
        
        guard !data.broken else {
            throw DataHandlingError.brokenData
        }
        
        guard data.owner.equalUser(anotherUser: user) else {
            throw DataHandlingError.notAuthenticaton(ownerName: data.owner.name)
        }
        
        return data
    }
    func clear() {
        datas.removeAll()
    }
    var empty: Bool {
        return datas.count == 0
    }
}

private func inspectTargetData(dataName: String, user: User,
                               handler: DataHandler) throws {
    let data = try handler.getData(dataName: dataName, user: user)
    print("\(data.description)")
}

private class ReservedData {
    private let data: Data
    init(dataName: String, user: User, handler: DataHandler) throws {
        self.data = try handler.getData(dataName: dataName, user: user)
    }
    var description: String {
        return "Reserved ... \(data.description)"
    }
}

func handleErrorByDoCatch() {
    let user = User(userId: "foo", password: "111"),
        dataName = "calculation",
        handler = DataHandler(datas: createSampleDatas())
    
    do {
        try inspectTargetData(dataName: dataName, user: user, handler: handler)
    } catch DataHandlingError.missingData {
        print("\"\(dataName)\" was not detected.")
    } catch DataHandlingError.brokenData {
        print("\"\(dataName)\" is broken.")
    } catch DataHandlingError.notAuthenticaton(let ownerName) {
        print("\"\(dataName)\" is owned by \(ownerName). \(user.name) cannot use it.")
    } catch {
        print("Unknown error was occured.")
    }
}

func handleErrorByOptionalValue() {
    let user = User(userId: "bar", password: "222"),
        dataName = "food",
        handler = DataHandler(datas: createSampleDatas())
    
    //do-catchを使わない場合，実際にどのようなエラーがスローされたのかを知ることができない。
    if let data = try? handler.getData(dataName: dataName, user: user) {
        print("Suceeded to get \(data.description).")
    } else {
        print("Fail to get \(dataName).")
    }
}

func handleErrorWithoutPropagation() {
    let user = User(userId: "baz", password: "333"),
        dataName = "demo",
        handler = DataHandler(datas: createSampleDatas())
    
    //try!を使うとエラーが伝播しないため関数の宣言部にthrowsを指定しなくてもよくなる。
    //しかし実際にエラーが発生すると実行時エラーとなってしまう。
    //関数を呼び出した側でcatchすることもできない。
    //do {
    let data = try! handler.getData(dataName: dataName, user: user)
    print(data.description)
    //} catch DataHandlingError.brokenData {
    //    print("")
    //}
}

//Specifying Cleanup Actions
func finishWorkByDefer() {
    let handler = DataHandler(datas: createSampleDatas())

    //deferに記述したコードは現在のスコープを抜ける時に実行される。
    //どこにでも記述できるfinallyのようにも見えるがエラーハンドリングに限定されず使用できる。
    defer {
        handler.clear()
        if handler.empty {
            print("DataHandler is cleared.")
        }
    }
    
    if !handler.empty {
       print("DataHandler is not empty.")
    }
}






