//
//  proxy.swift
//  DesignPattern
//
//

import Foundation

private struct ResultSet {
    let data: String
    init(data: String) {
        self.data = data
    }
    // computed propertyは戻り値の型を指定しない場合Voidだと見なされるため
    // 戻り値の値から型推論されない。
    var description: String {
        return "RESULT:\(data)"
    }
}

private let myDatabase = [
    "select sample from mytable": ResultSet(data: "Hello, my sample"),
    "select number from mytable": ResultSet(data: "123"),
    "select blob from mytable": ResultSet(data: "my object")
]

private protocol DBDriver {
    func query(statement: String) -> ResultSet?
    func connect()
    func close()
}

private class RealDBDriver: DBDriver {
    func query(statement: String) -> ResultSet? {
        let rs = myDatabase[statement]
        return rs
    }
    func connect() {
        print("Create connection now...")
    }
    func close() {
        print("Close connection")
    }
}

private class ProxyDBDriver: DBDriver {
    private var dbDriver: RealDBDriver?
    func query(statement: String) -> ResultSet? {
        return dbDriver?.query(statement: statement)
    }
    func connect() {
        if dbDriver == nil {
            dbDriver = RealDBDriver()
            dbDriver?.connect()
        }
    }
    func close() {
        if dbDriver != nil {
            dbDriver?.close()
        }
    }
}

private func createDBDriver() -> DBDriver {
    return ProxyDBDriver()
}

struct Proxy {
    static func main() {
        let driver = createDBDriver()
        driver.connect()
        if let result = driver.query(statement: "select sample from mytable") {
            print(result.description)
        }
        if let result = driver.query(statement: "select number from mytable") {
            print(result.description)
        }
        if let result = driver.query(statement: "select blob from mytable") {
            print(result.description)
        }
        driver.close()
    }
}
