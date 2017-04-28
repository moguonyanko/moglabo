//
//  type-casting.swift
//  PracticeSwift
//
//  Type Casting Practices
//

import Foundation

//Defining a Class Hierarchy for Type Casting
private class Vehicle {
    var name: String
    init(name: String) {
        self.name = name
    }
    var description: String {
        return name
    }
}

private class Truck: Vehicle {
    var capacity: Int
    init(name: String, capacity: Int) {
        self.capacity = capacity
        super.init(name: name)
    }
}

private class Boat: Vehicle {
    var hasMotor: Bool
    init(name: String, hasMotor: Bool) {
        self.hasMotor = hasMotor
        super.init(name: name)
    }
}

private func getSampleVehicles() -> [Vehicle] {
    let vehicles = [
        Truck(name: "my truck", capacity: 10),
        Boat(name: "manual boat", hasMotor: false),
        Truck(name: "his car", capacity: 5),
        Boat(name: "my motorboat", hasMotor: true),
        Truck(name: "big truck", capacity: 1000)
    ]
    
    return vehicles
}

//Checking Type
func checkingTypeWithDuducing() {
    var truckCount = 0,
        boatCount = 0
    
    //is演算子は他言語のinstanceofと同じ働きをする。
    for v in getSampleVehicles() {
        if v is Truck {
            truckCount += 1
        } else if v is Boat {
            boatCount += 1
        }
    }
    
    print("Truck count \(truckCount), Boat count \(boatCount)")
}

//Downcasting
func donwcastObjects() {
    let vehicles = getSampleVehicles()
    
    for vehicle in vehicles {
        //as!を使うと強制的にキャストを行うがキャストできない時に実行時エラーとなる。
        //let t = vehicle as! Truck
        
        if let truck = vehicle as? Truck {
            print("\"\(truck.name)\" can carry \(truck.capacity).")
        } else if let boat = vehicle as? Boat {
            print("Has \"\(boat.name)\" motor? ...  \(boat.hasMotor).")
        }
    }
}

//Type Casting for Any and AnyObject
private func getAnyList() -> [Any] {
    var anys = [Any]()
    
    anys.append(1)

    let n: Int? = nil
    //optional typeはAnyにキャストしないと警告が出る。
    //anys.append(n)
    anys.append(n as Any)
    
    anys.append(0)
    anys.append(0.0)
    anys.append(1.23)
    anys.append(-5.5)
    anys.append("Hello, world.")
    anys.append(("My score", 100))
    anys.append(Boat(name: "My canoe", hasMotor: false))
    //{ (引数名: 引数の型) -> 戻り値の型 in 関数本体 }
    anys.append({ (value: Int) -> Int in value + value })
    
    return anys
}

func displayAnyListElementsByMatching() {
    let things = getAnyList()
    
    for thing in things {
        switch thing {
        case 0 as Int:
            print("\(thing)(zero) as an Int")
        //以下のcaseではDouble型でthingをマッチしようとする。
        //しかしながらthingはAny型なのでコンパイルエラーとなる。
        //case 0.0:
        //    print("\(thing) as a Double")
        case 0 as Double:
            print("\(thing)(zero) as a Double")
        case let someInt as Int:
            print("\(someInt) as an Int")
        //Anyからoptional typeへのキャストはできない。
        //case内でなければas?やas!を使うことでキャストすることができる。
        //case let someOptionalInt as Int?:
        //    print("\(someOptionalInt) as an optional Int")
        case let someDouble as Double where someDouble < 0:
            print("\(someDouble) is negative double value")
        case is Double:
            print("\(thing) is some double value")
        case let someString as String:
            print("a string value of \"\(someString)\"")
        case let (name, value) as (String, Int):
            print("\(name) gets \(value) point")
        case let boat as Boat:
            print("\(boat.name) has \(boat.hasMotor ? "" : "not") motor")
        case let square as (Int) -> Int:
            print("a square of 2 is \(square(2))")
        default:
            print("something else: \(thing)")
        }
    }
}

private struct Fruit {
    let name: String
}

func displayAnyObjectList() {
    var things = [AnyObject]()
    
    //AnyObjectとして扱えるのはclassを介して生成されたオブジェクトのみ。
    //他はstructureも含め全てコンパイルエラーになる。
    //things.append("Good night")
    //things.append(Fruit(name: "lemon"))
    //things.append(123)
    //things.append({ (name: String) -> String in name + "!" })
    things.append(Truck(name: "My truck", capacity: 6))
    things.append(Boat(name: "Your motor boat", hasMotor: true))
    
    let truck: Truck? = Truck(name: "Any truck", capacity: 2)
    //optional typeは!を付けてunwrapするかasでAnyObjectにキャストしないと追加できない。
    //optional typeはAnyでもAnyObjectでもないということか。
    //asでキャストした時にunwrapされるのかもしれない。
    things.append(truck!)
    things.append(truck as AnyObject)
    
    //as?やas!でAnyObjectから他の型にキャストできる。
    let vehicles = things.map({ (t: AnyObject) -> Vehicle in t as! Vehicle } )
    
    let desc = vehicles.map({ (v: Vehicle) -> String in v.description })
                        .joined(separator: ",")
    
    print("AnyObject list: \(desc)")
}

