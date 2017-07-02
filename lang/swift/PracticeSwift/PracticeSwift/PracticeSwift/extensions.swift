//
//  extensions.swift
//  PracticeSwift
//
//  Extensions
//

import Foundation

//Computed Properties
private extension Double {
    var square: Double {
        return pow(self, 2.0)
    }
    var cube: Double {
        return pow(self, 3.0)
    }
    var m: Double {
        return self
    }
    var dm: Double {
        return self * 10
    }
}

func calcByCustomExtension() {
    print("The square of 2.0 is \(2.0.square)")
    print("The cube of 2.0 is \(2.0.cube)")
    print("10.5 meters is \(10.5.dm) deci-meters")
}

//Initializers
private struct Engine {
    var power = 3500
}

private struct Tire {
    var size = 50.5
}

private struct Bike {
    var engine = Engine()
    var tires = [Tire(), Tire()]
    var description: String {
        return "This bike has engine(\(engine.power)cc) and \(tires[0].size)cm tires."
    }
}

private extension Bike {
    init(standard: Bool) {
        if standard {
            let standardEngine = Engine(power: 4900)
            let standardTire = Tire(size: 69.7)
            self.init(engine: standardEngine, tires: [standardTire, standardTire])
        } else {
            self.init()
        }
    }
}

func adaptExtensionsWithInitializers() {
    let bike1 = Bike()
    print(bike1.description)
    
    let newTires = [Tire(size: 49.5), Tire(size: 49.5)]
    let bike2 = Bike(engine: Engine(power: 5000), tires: newTires)
    print(bike2.description)
    
    let bike3 = Bike(standard: true)
    print(bike3.description)
}

//Methods

//[Int]や[Double]といった配列のextensionは定義できない。Arrayを指定する必要がある。
private extension Array {
    func extensionMap(task: (Int) -> Int) -> [Int] {
        var results = [Int]()
        for element in self {
            if let number = element as? Int {
                results.append(task(number))
            }
        }
        return results
    }
}

func printCustomMapResults() {
    let sample = [1, 2, 3, 4, 5]
    let square = { (n: Int) -> Int in n * n }
    let results = sample.extensionMap(task: square)
    print("results = \(results.description)")
    
    let failSample = ["apple", "banana", "orange"]
    let results2 = failSample.extensionMap(task: square)
    print("Failed results = \(results2.description)")
}

//Mutating Instance Methods
private extension String {
    //mutatingが指定されていないとselfを変更することができずコンパイルエラー。
    mutating func extensionUpperCase() {
        self = self.uppercased()
    }
}

func displayMutatingMethod() {
    var names = ["foo", "bar", "baz"]
    //varを指定しないとimmutableだとみなされるためコンパイルエラーになる。
    //なお以下のfor文のように変数にコピーされた値に対してメソッドを呼び出しても
    //元の配列の要素は変更されない。
    for var name in names {
        name.extensionUpperCase()
    }
    
    names[0].extensionUpperCase()
    names[1].extensionUpperCase()
    names[2].extensionUpperCase()
    
    print(names.description)
}

//Subscripts

//同じ型に対して複数回extensionを定義してもエラーにはならない。
private extension String {
    subscript(index: Int) -> String {
        let i = self.index(self.startIndex, offsetBy: index, limitedBy: self.endIndex)
        //Stringの各文字に配列形式でアクセスするにはString.indexメソッドで返される
        //String.Index型のオブジェクトを用いる必要がある。
        //配列形式でアクセスして得られる値はCharacter型である。
        let element = String(self[i!])
        return element.uppercased()
    }
}

func updateStringsByExtensionSubscript() {
    let sample = "apple"
    print("\"\(sample)\" indexed 2 is \"\(sample[2])\"")
}

//Nested Types
private extension Int {
    //ParityをprivateにするとParityを返すプロパティparityも
    //privateにするように警告される。
    enum Parity {
        case even, odd
    }
    var parity: Parity {
        let remainder = self % 2
        switch remainder {
        case 0:
            return .even
        default:
            return .odd
        }
    }
}

func classifyNumbersByExtension() {
    let numbers = [0, 23, 9, 111, 32]
    for number in numbers {
        switch number.parity {
        case .even:
            print("\(number) is an even number")
        case .odd:
            print("\(number) is an odd number")
        }
    }
}

//Extension Declaration
private struct Rect {
    var width: Double
    var height: Double
}

private extension Rect {
    var area: Double {
        return width * height
    }
}

private final class Password {
    private let code: String
    init(code: String) {
        self.code = code
    }
}

//extensionにfinalを指定することはできないがfinalなclassに対しextensionを
//定義することはできる。
private extension Password {
    func encrypt() -> String {
        var tmp = [String]()
        for _ in code {
            tmp.append("*")
        }
        return tmp.joined()
    }
}

func doSampleWithExtensionOfFinalElements() {
    let rect = Rect(width: 10.5, height: 5.5)
    let password = Password(code: "SECRET")
    print("Rectangle area is \(rect.area)")
    print("PAssword is \(password.encrypt())")
}
