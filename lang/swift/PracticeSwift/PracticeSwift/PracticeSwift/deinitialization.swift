//
//  deinitialization.swift
//  PracticeSwift
//
//  Deinitialization practices
//

import Foundation

//Deinitializers in Action
private class MyDatabase {
    private var database: [String: Int] = [:]
    
    @discardableResult
    func remove(key: String) -> Int? {
        return database.removeValue(forKey: key)
    }
    
    var description: String {
        return database.description
    }
    
    subscript(key: String) -> Int? {
        get {
            return database[key]
        }
        set {
            database[key] = newValue
        }
    }
}

private let sampleDB = MyDatabase()

private class MyDBUser {
    private let name: String
    private var addedKeys: [String] = []
    
    //convenience init() {
    //    //convenience initではletで宣言されたプロパティを初期化できない。
    //    self.name = "anonymous"
    //}
    
    init?(name: String) {
        if name.isEmpty {
            return nil
        }
        self.name = name
    }
    
    func addToDB(key: String, value: Int) {
        sampleDB[key] = value
        addedKeys.append(key)
    }
    
    var userName: String {
        return self.name
    }
    
    deinit {
        for key in addedKeys {
            sampleDB.remove(key: key)
        }
        print("Added by'\(name)' values have removed by deinitializer.")
    }
}

private func addSampleDatas(user: MyDBUser, keys: [String], values: [Int]) {
    for i in 0..<min(keys.count, values.count) {
        user.addToDB(key: keys[i], value: values[i])
    }
}

func displayDeinitializationInstanceAction() {
    func runTest(userName name: String) -> MyDBUser {
        let user = MyDBUser(name: name)
        let keys = ["apple", "orange", "lemon"]
        let values = [100, 200, 300]
        addSampleDatas(user: user!, keys: keys, values: values)
        print("User '\(user?.userName ?? "none")' added data: \(sampleDB.description)")
        return user!
    }
    
    func runTest2(_ name: String) {
        let user = MyDBUser(name: name)
        let keys = ["java", "csharp", "swift"]
        let values = [1, 2, 3]
        addSampleDatas(user: user!, keys: keys, values: values)
        print("User '\(user?.userName ?? "none")' added data: \(sampleDB.description)")
    }
    
    //Function typeは外部から呼ばれる時に参照される引数名を指定することができない。
    let addData: (_ userName: String) -> MyDBUser = runTest
    let addData2: (_ userName: String) -> Void = runTest2
    
    print("Before user add data: \(sampleDB.description)")
    
    //MyDBUserのインスタンスが'参照不可能'になった時点でMyDBUserのdeinitが呼び出される。
    //例えば戻り値のMyDBUserを変数に保持するとdeinitが呼び出されないが，_を使って戻り値を
    //無視すると即座にdeinitが呼び出される。
    let _ = addData("goma")
    //nilを代入するとdeinitが呼び出される。
    //user = nil
    //戻り値が無い場合はすぐにdeinitが呼び出される。
    addData2("usao")
    
    print("After user added data: \(sampleDB.description)")
}














