//
//  methods.swift
//  PracticeSwift
//
//  Methods practice
//

import Foundation

//Modifying Value Types from Within Instance Mehtods
private struct Point3D {
    var x = 0, y = 0, z = 0
    
    //mutatingはclassのメソッドには指定できない。
    mutating func moveTo(_ deltaX: Int, _ deltaY: Int, _ deltaZ: Int) {
        x += deltaX
        y += deltaY
        z += deltaZ
    }
}

func modifyValueTypeInstance() {
    var p = Point3D()
    
    //pがletで宣言されていた場合はコンパイルエラー。
    //mutatingが指定されたメソッド経由でも定数のオブジェクトを変更することはできない。
    p.moveTo(1, 2, 3)
    
    print("Now point coords = (\(p.x),\(p.y),\(p.z))")
}

//Assigning to self Within a Mutating Method
private enum Direction {
    case north, east, south, west
    mutating func turn() {
        switch self {
        case .north:
            self = .east
        case .east:
            self = .south
        case .south:
            self = .west
        case .west:
            self = .north
        }
    }
}

func mutateEnumCases() {
    var direction = Direction.north
    
    direction.turn()
    direction.turn()
    
    print("Direction is \(direction)")
}


//Type Methods
private class Car {
    private static let version = 1
    
    let name: String
    
    //type methodからであればtype propertyの前に型が指定されていなくても
    //コンパイルエラーにならない。Car.versionと書かなくてもいい。
    class func getNextVersion() -> Int {
        return version + 1
    }
    
    init(name: String) {
        self.name = name
    }
    
    func run() {
        print("Car \(name) is running")
    }
}

private struct Park {
    static let maxCars = 3
    //staticが指定されていない同名のプロパティは宣言してもエラーにならない。
    let maxCars = 100
    var cars: [Car] = []
    
    //mutatingが無いまたはcarsがletで宣言されていたらコンパイルエラー。
    //@discardableResultが無いと戻り値を使っていないコードが警告される。
    @discardableResult
    mutating func addCar(car: Car) -> Bool {
        //Park.maxCarsではなくmaxCarsとしてしまうとコンパイルエラーになる。
        //instance methodからtype property及びtype methodを参照する時は
        //常に型を指定する。
        if (cars.count < Park.maxCars) {
            cars.append(car)
            return true
        } else {
            return false
        }
    }
}

func checkActionOfTypeMethods() {
    var park = Park()
    
    print("Car next version \(Car.getNextVersion())")
    
    park.addCar(car: Car(name: "foo car"))
    park.addCar(car: Car(name: "bar car"))
    park.addCar(car: Car(name: "baz car"))
    
    let car = Car(name: "hoge")
    
    if !park.addCar(car: car) {
        print("Failed add \(car.name)")
    }
    
    for c in park.cars {
        c.run()
    }
}
