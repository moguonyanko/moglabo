//
//  flyweight.swift
//  DesignPattern
//
//

import Foundation

private struct Car {
    let name: String
    var description: String {
        return "This car name is \(name)"
    }
}

private class CarFactory {
    private var cars = [String: Car]()
    fileprivate func getCar(_ name: String) -> Car {
        if let car = cars[name] {
            return car
        } else {
            let newCar = Car(name: name)
            print("\(name) is created!")
            cars[name] = newCar
            return newCar
        }
    }
}

struct Flyweight {
    static func main() {
        let factory = CarFactory()
        let cars = [
            factory.getCar("super car"),
            factory.getCar("foo car"),
            factory.getCar("foo car"),
            factory.getCar("big car"),
            factory.getCar("super car"),
            factory.getCar("old car"),
            factory.getCar("big car"),
            factory.getCar("truck"),
            factory.getCar("old car"),
        ]
        cars.forEach { print($0.description) }
    }
}
