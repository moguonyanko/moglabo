//
//  optional-chaining.swift
//  PracticeSwift
//
//  Optional Chaining Practices
//

import Foundation

//Defining Model Classes for Optional Chaining
private class Admiral {
    let name: String
    var fleet: Fleet?
    init(name: String) {
        self.name = name
    }
    deinit {
        print("Admiral \(name) is being deinitialized.")
    }
}

private class Fleet {
    var ships = [Ship]()
    var numberOfShips: Int {
        return ships.count
    }
    var fleetInfomation: FleetInfomation?
    subscript(index: Int) -> Ship {
        get {
            return ships[index]
        }
        set {
            ships[index] = newValue
        }
    }
    func printNumberOfShips() {
        print("The number of ships is \(numberOfShips)")
    }
    deinit {
        print("Fleet is being deinitialized.")
    }
}

private class Ship {
    let name: String
    var karyoku: Int = 0
    var raisou: Int = 0
    init(name: String) {
        self.name = name
    }
    convenience init(name: String, karyoku: Int, raisou: Int) {
        self.init(name: name)
        self.karyoku = karyoku
        self.raisou = raisou
    }
    deinit {
        print("Ship \(name) is being deinitialized.")
    }
}

private class FleetInfomation {
    var fleetName: String?
    var fleetNumber: Int?
    //練習のためわざと循環参照させる。
    //admiralにweakを指定してweak referenceにしない場合，
    //admiralから辿れるオブジェクトのメモリはadmiral自身も含めてどれも回収されない。
    //定数ではないためunowned referenceにはできない。
    weak var admiral: Admiral?
    func printAdmiralName() {
        print("\(admiral?.name ?? "NO NAME")")
    }
    func buildingIdentifier() -> String? {
        if let fleetNumber = fleetNumber, let admiral = admiral {
            //このブロックのローカル変数admiralはnon-optionalになるので
            //admiral?.nameではなくadmiral.nameと書かなければならない。
            return "No.\(fleetNumber) fleet of \(admiral.name)"
        } else if fleetName != nil {
            return fleetName
        } else {
            return nil
        }
    }
    deinit {
        print("FleetInfomation is being deinitialized.")
    }
}

private func getDefaultAdmiral() -> Admiral {
    return Admiral(name: "mog")
}

//Accessing Properties Through Optional Chaining
func checkOptionalChainingByAccessingProperties() {
    let admiral = getDefaultAdmiral()
    if let shipCount = admiral.fleet?.numberOfShips {
        print("Admiral \(admiral.name) has \(shipCount) ships.")
    } else {
        print("Admiral \(admiral.name) has no ships.")
    }
}

//Calling Methods Through Optional Chaining
private func createFleetInfomation(_ admiral: Admiral) -> FleetInfomation {
    print("Function was called.")
    
    let info = FleetInfomation()
    info.fleetNumber = 1
    info.admiral = admiral
    
    return info
}

func failSetProperty() {
    let admiral = getDefaultAdmiral()
    //fleetがnilなので右辺の関数は評価されない。従って右辺の関数の出力内容が表示されることもない。
    //当然オブジェクトも生成されないのでそのオブジェクトのdeinitも実行されない。
    admiral.fleet?.fleetInfomation = createFleetInfomation(getDefaultAdmiral())
}

func printVoidResult() {
    let admiral = getDefaultAdmiral()
    
    //admiralのfleetプロパティがnilなので以下の処理は全てelse側に進む。
    
    if admiral.fleet?.printNumberOfShips() != nil {
        print("It was possible to print the numberof ships.")
    } else {
        print("It was not possible to print the numberof ships.")
    }
    
    if (admiral.fleet?.fleetInfomation = createFleetInfomation(admiral)) != nil {
        print("It was possible to set the fleet infomation.")
    } else {
        print("It was not possible to set the fleet infomation.")
    }
}

private func printFirstShipName(admiral: Admiral) {
    if let firstShipName = admiral.fleet?[0].name {
        print("The first ship name is \(firstShipName).")
    } else {
        print("Unable to retrieve the first ship name.")
    }
}

//Accessing Subscripts Through Optional Chaining
func checkOptionalChainingByAccessingSubscripts() {
    let admiral = getDefaultAdmiral()
    admiral.fleet?[0] = Ship(name: "Samidare")
    //subscriptを介した場合でもfleetがnilなので値が設定されない。
    printFirstShipName(admiral: admiral)
    
    let fleet = Fleet()
    fleet.ships.append(Ship(name: "Samidare"))
    fleet.ships.append(Ship(name: "Yubari"))
    admiral.fleet = fleet
    
    //fleetがnilでないのでプロパティの内容を表示できる。
    printFirstShipName(admiral: admiral)
}

//Accessing Subscripts of Optional Type
func printOptionalTypeOfDictionary() {
    var items: [String: [String]] = [
        "fluit": ["orange", "banana", "peech"],
        "vehicle": ["bike"]
    ]
    
    items["fluit"]?[0] = "lemon"
    items["vehicle"]?[0] = "car"
    //?を付けたoptional typeの場合，存在しないキーへの操作は無視される。
    items["book"]?[0] = "swift guide"
    
    print(items)
}

private func printCycricAdmiralName(admiral: Admiral) {
    //プロパティアクセスの途中でnilが見つかったとしても戻り値の型は最後のプロパティの型に従う。
    //以下の「admiral.fleet?.fleetInfomation?.admiral」であればfleetInfomationが
    //nilでそれ以上プロパティを辿れなかったとしても，戻り値の型は最後のadmiralに従いAdmiral?になる。
    //ただしadmiralInFleetの型はAdmiral?ではなくAdmiralである。
    if let admiralInFleet = admiral.fleet?.fleetInfomation?.admiral {
        print("Fleet infomation has admiral '\(admiralInFleet.name)'.")
    } else {
        print("Unable to retrievethe fleet infomation.")
    }
}

//Linking Multiple Levels of Chaining
func printOptionalTypeByMultipleChaining() {
    let admiral = getDefaultAdmiral()
    admiral.fleet = Fleet()
    
    printCycricAdmiralName(admiral: admiral)
    
    //プロパティを設定すればプロパティを辿って結果を表示できる。
    admiral.fleet?.fleetInfomation = createFleetInfomation(admiral)
    printCycricAdmiralName(admiral: admiral)
}

//Chaining on Methods with Optional Return Values
func printResultWithMultipleOptionReturnValues() {
    let admiral = getDefaultAdmiral()
    
    let fleet = Fleet()
    fleet.ships.append(Ship(name: "shokaku"))
    fleet.ships.append(Ship(name: "haruna"))
    fleet.ships.append(Ship(name: "graf"))
    
    let fleetInfo = FleetInfomation()
    fleetInfo.fleetName = "My fleet"
    fleetInfo.admiral = admiral
    fleet.fleetInfomation = fleetInfo
    
    //練習のため循環参照を作っている。
    admiral.fleet = fleet
    
    if let id = admiral.fleet?.fleetInfomation?.buildingIdentifier() {
        print("\(admiral.name) has fleet that is identified '\(id)'")
    }
    
    //buildingIdentifier呼び出しの結果を使って処理を進めたいならbuildingIdentifier()の
    //後ろに?が必要になる。buildingIdentifierの戻り値がString?型だからである。
    if let beginsWithMy =
        admiral.fleet?.fleetInfomation?.buildingIdentifier()?.hasPrefix("My") {
        if beginsWithMy {
            print("\(admiral.name) fleet identifier begins with \"My\"")
        } else {
            print("\(admiral.name) fleet identifier does not begins with \"My\"")
        }
    }
}

















