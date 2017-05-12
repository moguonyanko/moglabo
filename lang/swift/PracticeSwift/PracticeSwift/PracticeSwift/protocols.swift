//
//  protocols.swift
//  PracticeSwift
//
//  Protocols practices
//

import Foundation

//Protocol syntax
private protocol SomeProtocol {
    //pass
}

private protocol AnyProtocol {
    //pass
}

//structureもprotocolを継承できる。
private struct SomeStructure: SomeProtocol, AnyProtocol {
    //pass
}

private class BaseClass {
    //pass
}

//protocolをクラス定義に複数指定することは可能。
private class SubClass: BaseClass, SomeProtocol, AnyProtocol {
    //pass
}

//Property Requirements
private protocol Priced {
    //プロパティも契約に含めることができる。
    //privateを指定することはできない。
    var price: Int { get }
}

private struct SmartPhone: Priced {
    //protocolで宣言されたプロパティを定義していないとコンパイルエラーになる。
    //アクセス修飾子はprotocolで宣言された内容に合わせなければならない。
    //アクセス修飾子未指定はfileprivateを指定したのと同じになる。
    fileprivate var price: Int
}

private class Magazine: Priced {
    //protocolでの動作確認のためだけにoptionalにしている。本来はIntにするべき。
    private let basePrice: Int?
    static let taxRate: Double = 0.1
    init(basePrice: Int? = nil) {
        self.basePrice = basePrice
    }
    //basePriceはoptionalでありnilを許容する型であるが，protocolでnilが許容されていないので
    //nilを返すことができないようになっている。具象的な値を返すことをprotocolで強制することができる。
    var price: Int {
        let base = basePrice != nil ? basePrice! : 0
        let value = Double(base) * (1.0 + Magazine.taxRate)
        return Int(value)
    }
}

func checkProtocolAccessor() {
    let phone = SmartPhone(price: 10000)
    print("This phone priced \(phone.price)")
    
    let magazine = Magazine(basePrice: 980)
    print("This magazine priced \(magazine.price)")
    
    let freeMagazine = Magazine()
    print("This is free magazine, that is priced \(freeMagazine.price)")
}

//Method Requirements
private protocol Calculator {
    //protocolでは配列の要素の型をジェネリックスで指定しなければコンパイルエラーになる。
    func add(arg: Array<Int>) -> Int
}

private class Addition: Calculator {
    func add(arg: Array<Int>) -> Int {
        var a = 0
        for i in arg {
            a += i
        }
        return a
    }
}

func checkProtocolMethods() {
    let adder = Addition()
    let result = adder.add(arg: [1, 2, 3, 4, 5])
    print("Addition result = \(result)")
}

//Mutating Method Requirements
private protocol Directable {
    mutating func turn()
}

private enum Compass: Directable {
    case top, bottom, right, left
    mutating func turn() {
        switch self {
        case .top:
            self = .right
        case .right:
            self = .bottom
        case .bottom:
            self = .left
        case .left:
            self = .top
        }
    }
}

private class Robot: Directable {
    private enum Directions: Int {
        case front = 1, back, right, left
        var description: String {
            switch self {
            case .front:
                return "前"
            case .right:
                return "右"
            case .back:
                return "後ろ"
            case .left:
                return "左"
            }
        }
    }
    private let directionsCount = UInt32(Directions.left.rawValue)
    private var direction: Directions? = Directions.front
    //classもprotocolに定義されたmutatingなメソッドを実装することはできるが
    //mutatingを指定することはできない。
    func turn() {
        let code = arc4random_uniform(directionsCount) + 1
        self.direction = Directions(rawValue: Int(code))
    }
    var description: String {
        return "ロボットは \(direction!.description) を向いています。"
    }
}

func checkProtocolMutating() {
    //mutatingなメソッドを呼び出すためletで宣言できない。
    var compass = Compass.top
    compass.turn()
    compass.turn()
    print("Compass direct \(compass)")
    
    let robot = Robot()
    robot.turn()
    robot.turn()
    print(robot.description)
}

//Initializer Requirements
//Class Implementations of Protocol Initializer Requirements
private protocol Agable {
    init(age: Int)
}

//classとprotocolを両方指定した場合の振る舞いを確認するために
//AnimalにはAgableを実装しない。
private class Animal {
    let age: Int
    //継承された際に他のprotocolのinitとシグネチャが衝突しても
    //サブクラスでoverrideが指定されれば問題無い。
    init(age: Int) {
        self.age = age
    }
}

private class Human: Animal, Agable {
    private var name: String
    //protocolで宣言されたものと同じシグネチャのinitが定義されなければコンパイルエラーになる。
    //変数名も一致していなければならない。finalクラスでなければrequiredの指定も必須である。
    //requiredが指定されることによりprotocolの要求するinitの定義をサブクラスでも強制できる。
    required override init(age: Int) {
        //このname初期化はsuper.initより上に書かないとコンパイルエラーになる。
        //スーパークラスではなく自身のプロパティ初期化だからかもしれない。
        self.name = "anonymous"
        super.init(age: age)
    }
    convenience init(name: String, age: Int) {
        self.init(age: age)
        //namerは継承されたプロパティではないが以下の文はself.initよりも上に書くことはできない。
        self.name = name
    }
    var description: String {
        return "\(name) is \(super.age) years old."
    }
}

func checkProtocolInitializer() {
    let foo = Human(name: "Foo", age: 45)
    print(foo.description)
}

//Failable Initializer Requirements
private protocol Failable {
    init?(name: String)
}

private class SampleUser: Failable {
    private var name: String!
    //init?ではなくinitにしてもコンパイルできる。
    //つまりfailableをnon-failableにして実装するのは問題無い。
    //逆にnon-failableなinitをfailableにして実装しようとするとコンパイルエラーになる。
    required init?(name: String) {
        if name.isEmpty {
            return nil
        }
        self.name = name
    }
    var description: String {
        return "User name is \"\(name)\""
    }
}

func checkProtocolFailableInitializer() {
    if let u = SampleUser(name: "") {
        print(u.description)
    } else {
        print("Failed creating user.")
    }
}

//Protocols as Types












