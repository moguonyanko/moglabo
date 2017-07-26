//
//  mvc.swift
//  DesignPattern
//
//

import Foundation

// Model
private struct Car {
    var name: String
}

// View
private struct CarView {
    func getNameListElement(names: [String]) -> String {
        var list = "<ul>"
        let nameEles = names.map {
            return "<li>\($0)</li>"
        }
        list += nameEles.joined() + "</ul>"
        return list
    }
}

// Controller
private class CarController {
    var cars = [String: Car]()
    let view: CarView
    init(view: CarView) {
        self.view = view
    }
    func addCar(id: String, car: Car) {
        cars[id] = car
    }
    func removeCar(id: String) -> Car? {
        return cars.removeValue(forKey: id)
    }
    func printNameList() {
        let names = cars.values.map { $0.name }
        let list = view.getNameListElement(names: names)
        print(list)
    }
}

struct MVC {
    static func main() {
        let car1 = Car(name: "my car")
        let car2 = Car(name: "old car")
        let car3 = Car(name: "your truck")
        let carView = CarView()
        let controller = CarController(view: carView)
        controller.addCar(id: "A1", car: car1)
        controller.addCar(id: "A2", car: car2)
        controller.addCar(id: "B1", car: car3)
        controller.printNameList()
        // guardを使うときは必ずreturnやthrowで抜けなければならない。
        guard let removedCar = controller.removeCar(id: "A2") else {
            return
        }
        print("Removed \"\(removedCar.name)\"")
        controller.printNameList()
    }
}
