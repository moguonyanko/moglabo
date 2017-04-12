//
//  initialization.swift
//  PracticeSwift
//
//  Initialization practices
//

import Foundation

//Initialization Parameters

private struct Angle {
//    private var radian: Double {
//        get {
//            //getterを定義してもprivateなプロパティには外部からアクセスできない。
//            return self.radian
//        }
//        set {
//            //setterが定義されなければinitでも値を設定できない。
//            self.radian = newValue
//        }
//    }
    private let radian: Double
    init(fromRadian radian: Double) {
        self.radian = radian
    }
    //引数名が異なれば異なるinitとみなされる。
    init(fromDegree degree: Double) {
        let pi = NSDecimalNumber(decimal: Decimal.pi).doubleValue
        self.radian = degree * pi / 180
    }
    func getRadian() -> Double {
        return self.radian
    }
}

func displayInstancesByOverloadInit() {
    let degree = 90.0
    let ang1 = Angle(fromDegree: degree)
    let ang2 = Angle(fromRadian: 1.5)
    
    print("First angle radian from \(degree) degree = \(ang1.getRadian())")
    print("Second angle radian = \(ang2.getRadian())")
}

//Initializer Parameters Without Argument Labels
private struct Student {
    private let name: String
    private let score: Int
    private static let defaultMemo = "none"
    //String?型だがletで宣言しているため初期化が強制される。
    private let memo: String?
    init(name: String, score: Int, memo: String?) {
        self.name = name
        self.score = score
        self.memo = memo ?? Student.defaultMemo
    }
    init(name: String, score: Int) {
        self.init(name: name, score: 0, memo: Student.defaultMemo)
    }
    //init(name: String, score: Int)と衝突せずコンパイルされ呼び出せる。
    init(_ name: String, _ score: Int) {
        self.init(name: name, score: score)
    }
    init(name: String) {
        self.init(name: name, score: 0)
    }
    var description: String {
        get {
            //memoはString?型なのでletで宣言されていてもデフォルト値の提供を要求される。
            return "\(name) got score is \(score) and \(memo ?? Student.defaultMemo)"
        }
    }
}

func checkInitlabels() {
    let s1 = Student(name: "Hoge", score: 100)
    let s2 = Student(name: "Fuga")
    let s3 = Student("Mike", 50)
    let s4 = Student(name: "Hoge", score: 100, memo: "sample instance")
    
    print(s1.description)
    print(s2.description)
    print(s3.description)
    print(s4.description)
}

//Default Initializer
private class AuthenticationInfo {
    //nilを受け付ける型ではなく初期化されていないプロパティがあったら
    //デフォルトのinitは提供されずコンパイルエラーになる。
    private var name = "anonymous"
    private var password: String?
    
    var description: String {
        get {
            return "\(name):\(password ?? "no password")"
        }
    }
}

private struct MyRectangle {
    //各プロパティをprivateで宣言するとこのstructure外で初期化できずエラーになる。
    //privateで宣言したければinitを明示的に定義する必要がある。
    let width: Double
    let height: Double
    //String?型だがこのstructureの初期化時にmemoの初期値の指定は必須である。
    var memo: String?
    
    //以下のinitがコメントアウトされていなければプロパティをprivateにしても
    //structureのインスタンス生成はコンパイルに成功する。
//    init(width: Double, height: Double, memo: String) {
//        self.width = width
//        self.height = height
//        self.memo = memo
//    }
    
    var description: String {
        return "This rectangle width = \(width), height = \(height), \(memo ?? "none")"
    }
}

func printDefaultInitInstance() {
    let auth = AuthenticationInfo()
    print("\(auth.description)")
    
    //structureは自動的にプロパティに対応した引数を受け取る暗黙のinitが定義される。
    //ただし各プロパティはstructure外からアクセスできる必要がある。
    //initが明示的に定義されていればstructure外からアクセスできなくてもインスタンス生成できる。
    //カプセル化を促したければ暗黙のinitを利用するべきでない。
    let rect = MyRectangle(width: 10.0, height: 12.5, memo: "hogehoge")
    print(rect.description)
}

//Initializer Delegation for Value Types
private struct Point2D {
    //初期値が与えられていないとPoint2d()の呼び出しはエラーになる。
    var x = 0.0
    var y = 0.0
    var description: String {
        get {
            return "(\(x),\(y))"
        }
    }
}

private struct Circle {
    var center = Point2D()
    var radius = 0.0
    
    init() {}
    
    init(center: Point2D, radius: Double) {
        self.center = center
        self.radius = radius
    }
    
    init(bottomLeft: Point2D, topRight: Point2D, radius: Double) {
        let centerX = (topRight.x - bottomLeft.x) / 2
        let centerY = (topRight.y - bottomLeft.y) / 2
        let p = Point2D(x: centerX, y: centerY)
        //他のinit呼び出しがinitの先頭でなくてもよい。
        self.init(center: p, radius: radius)
    }
    
    init(topLeft: Point2D, bottomRight: Point2D, radius: Double) {
        let centerX = (bottomRight.x - topLeft.x) / 2
        let centerY = (bottomRight.y - topLeft.y) / 2
        let p = Point2D(x: centerX, y: centerY)
        self.init(center: p, radius: radius)
    }
    
    var description: String {
        get {
            return "center = \(center.description), radius = \(radius)"
        }
    }
}

func displayInstancesByValueTypeInitializers() {
    let c1 = Circle()
    let c2 = Circle(center: Point2D(x: 1.0, y:2.0), radius: 5.5)
    let c3 = Circle(bottomLeft: Point2D(x: 3.0, y: 3.0),
                    topRight: Point2D(x: 7.0, y: 7.0), radius: 10.0)
    //より引数名が合致する方のinitが呼び出される。
    let c4 = Circle(topLeft: Point2D(x: 6.0, y: 14.0),
                    bottomRight: Point2D(x: 10.0, y: 8.0), radius: 4.0)
    
    print(c1.description)
    print(c2.description)
    print(c3.description)
    print(c4.description)
}

//Initializer Inheritance and Overriding
private class Animal {
    var cry = "..."
    var description: String {
        return "\(cry)! \(cry)!"
    }
}

private class Dog: Animal {
    //スーパークラスに同じシグネチャのinitが定義されている場合，
    //override無しではコンパイルできない。自動的に継承されたりはしない。
    //init() {}
    
    override init() {
        super.init()
        //super classのプロパティにアクセスしているため
        //super.initより上に記述することができない。
        cry = "wan wan"
    }
}

func displayInheritanceInits() {
    let animal = Animal()
    let dog = Dog()
    
    print(animal.description);
    print(dog.description);
}

//Automatic Initializer Inheritance
private class Car {
    var name = "none"
    var speed = 0
    
    convenience init(_ name: String, _ speed: Int) {
        self.init()
        self.name = name
        self.speed = speed
    }
    
    var description: String {
        return "This car name is \(name), the speed is \(speed) km/h."
    }
}

private class Taxi: Car {
    convenience init(_ name: String) {
        //convenience initではsuper classのinitを呼び出すことはできない。
        //同じクラス内のinitに処理を委譲することしか許されない。
        //super.init()
        
        //引数無しのinitが自動的に継承されているので呼び出せる。
        //initの先頭で呼び出さないとエラーになる。
        //super.initではないことに注意。
        self.init()
        //selfの継承されたプロパティにはself.initより後でなければアクセスできない。
        self.name = name
    }
}

func dumpInstancesByCreatingAutomaticInitializers() {
    let car = Car("FOO", 100)
    let taxi = Taxi("New Taxi")
    //super classのconvenience init(String, Int)が自動的に継承されているので呼び出せる。
    let taxi2 = Taxi("Hi speed taxi", 1000)
    
    print(car.description);
    print(taxi.description);
    print(taxi2.description);
}

//Designated and Convenience Initializers in Action
private class Building {
    var name: String
    convenience init() {
        self.init(name: "no name")
    }
    init(name: String) {
        self.name = name
    }
}

private class Hotel:Building {
    var charges: Int
    private static let industryStandardCharges = 10000
    //init()を定義していないのでsuper classの暗黙のinit()が自動的に継承されている。
    //引数を取るinitが定義されていても引数無しのinitが自動的に継承されている。
    init(name: String, charges: Int) {
        //chargesはsuper classではなくこのsub classで定義されたプロパティである。
        //そのためsuper.initより先にアクセスしてもエラーにはならない。
        self.charges = charges
        //chargesは継承されたプロパティではないため，後続のsuper.initを削除して
        //initializerを複数回呼ばないようにすればself.init()はコンパイルに成功する。
        //従ってself.initより前でself.chargesにアクセスしても問題無い。
        //chargesがsuper classで定義されていたらコンパイルエラーになる。
        //要するに「継承されたプロパティ」には呼び出し元がselfだろうがsuperだろうが
        //initより「後」でしかアクセスできないということである。
        //self.init()
        super.init(name: name)
    }
    //たとえconvenienceが指定されていても，super classのinit(name: String)を
    //上書きするinitだと見なされるためoverrideの指定が必須である。
    override convenience init(name: String) {
        self.init(name: name, charges: Hotel.industryStandardCharges)
    }
}

private class CapsuleHotel: Hotel {
    var staying = false
    //super classのinitは全て自動的に継承されている。
    var description: String {
        var desc = "'\(name)', stay one night ¥\(charges) "
        desc += "vacancy=" + (staying ? "x" : "o")
        return desc
    }
}

func displayActionInitializers() {
    let hotel1 = CapsuleHotel()
    let hotel2 = CapsuleHotel(name: "SeaSideHotel")
    let hotel3 = CapsuleHotel(name: "SuburbHotel", charges: 5000)
    
    //classのインスタンスなのでletで定義されていてもプロパティ変更可能。
    hotel1.name = "RoadHotel"
    hotel1.staying = true
    
    let hotels = [ hotel1, hotel2, hotel3 ]
    
    for hotel in hotels {
        print(hotel.description)
    }
}

//Failable Initializers
private struct Password {
    private let value: String
    init?(value: String) {
        if value.isEmpty {
           return nil
        }
        self.value = value
    }
    var description: String {
        return "******"
    }
}

func displayInstanceByFailableInitializer() {
    let pw1 = Password(value: "secret")
    
    print("Password: \(pw1?.description ?? "none")")
    
    let pw2 = Password(value: "")
    
    if pw2 == nil {
        print("Fail to initialize Password instance.")
    }
}

//Failable Initializers for Enumerations
private enum Direction: String {
    case up = "u", down = "d", right = "r", left = "l"
    
    //init?でnilを返さなくてもエラーにはならない。
    init?(key: Character) {
        switch key {
        case "U":
            self = .up
        case "D":
            self = .down
        case "R":
            self = .right
        case "L":
            self = .left
        default:
            return nil
        }
    }
    
    var description: String {
        return self.rawValue
    }
}

func displayFailableEnumeration() {
    let d1 = Direction(key: "U")
    print("Selected direction 1 = \(d1?.description ?? "unknown")")
    
    let d2 = Direction(key: "W")
    if d2 == nil {
        print("Unknown direction 2")
    }
    
    let d3 = Direction(rawValue: "r")
    print("Selected direction 3 = \(d3?.description ?? "unknown")")
    
    let d4 = Direction(rawValue: "o")
    if d4 == nil {
        print("Unknown direction 4")
    }
}

//Propagation of Initialization Failure














