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











