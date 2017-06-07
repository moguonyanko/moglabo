//
//  builder.swift
//  DesignPattern
//
//

import Foundation

private protocol Car {
    //associatedtypeを含むprotocolを外部の変数や戻り値の型として指定することはできない。
    //associatedtype Parts
    typealias Parts = String
    var partsNameList: [Parts] { get }
    init(partsNameList: [Parts])
    func drive()
}

private extension Car {
    //privateを指定するとCarに従ったclassやstructureからアクセスできない。
    func dumpPartsNameList() -> String {
        return self.partsNameList.joined(separator: ",")
    }
}

private struct OpenCar: Car {
    var partsNameList: [String]
    init(partsNameList: [String]) {
        self.partsNameList = partsNameList
    }
    func drive() {
        print("Driving open car equipped \(partsNameList.description)")
    }
}

private struct Truck: Car {
    var partsNameList: [String]
    init(partsNameList: [String]) {
        self.partsNameList = partsNameList
    }
    func drive() {
        print("Driving truck equipped \(partsNameList.description)")
    }
}

private protocol CarBuilder {
    associatedtype CarProduct
    //CarBuilderをメソッドの戻り値として宣言することはできない。Selfを返すように宣言する。
    //func addParts(name: String) -> Self
    init(engine: String, tire: String, body: String)
    func build() -> CarProduct
}

private class OpenCarBuilder: CarBuilder {
    //Essential members
    private let engineName: String
    private let tireName: String
    private let bodyName: String
    //Options
    private var roofName = "none"
    required init(engine: String, tire: String, body: String) {
        engineName = engine
        tireName = tire
        bodyName = body
    }
    func roof() -> Self {
        roofName = "automatic opening and closing roof"
        return self
    }
    func build() -> Car {
        //本来はここで入力内容のチェック等を行う。
        return OpenCar(partsNameList: [
            engineName, tireName, bodyName, roofName
        ])
    }
}

private class TruckBuilder: CarBuilder {
    //Essential members
    private var engineName: String = ""
    private var tireName: String = ""
    private var bodyName: String = ""
    //Options
    private var carryingName = "normal size carrying"
    required init(engine: String, tire: String, body: String) {
        engineName = engine
        tireName = tire
        bodyName = body
    }
    func carrying() -> Self {
        carryingName = "big size carrying"
        return self
    }
    func build() -> Car {
        return Truck(partsNameList: [
            engineName, tireName, bodyName, carryingName
        ])
    }
}

private func runAllCases() {
    let openCarBuilder = OpenCarBuilder(engine: "smart engine",
                                             tire: "smart tire",
                                             body: "thin body")
    let openCar = openCarBuilder.roof().build()
    openCar.drive()
    let truckBuilder = TruckBuilder(engine: "hi power engine",
                           tire: "thick tire",
                           body: "strong body")
    let truck = truckBuilder.carrying().build()
    truck.drive()
}

struct Builder {
    static func main() {
        print("***** Builder Pattern *****")
        runAllCases()
    }
}
