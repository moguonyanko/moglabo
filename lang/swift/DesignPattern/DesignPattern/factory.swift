//
//  factory.swift
//  DesignPattern
//
//

import Foundation

private protocol Car {
    var name: String { get }
}

private extension Car {
    var description: String {
        return "This is \"\(name)\""
    }
}

private struct Truck: Car {
    let name: String
}

private struct SportsCar: Car {
    let name: String
}

private struct Bus: Car {
    let name: String
}

private enum CarType {
    case truck, sportsCar, bus
}

private class CarFactory {
    static func create(type: CarType, name: String) -> Car {
        switch type {
        case .truck:
            return Truck(name: name)
        case .sportsCar:
            return SportsCar(name: name)
        case .bus:
            return Bus(name: name)
        }
    }
}

struct Factory {
    static func main() {
        let truck = CarFactory.create(type: .truck, name: "My working truck")
        print("\(truck.description)")
    }
}
