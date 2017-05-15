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
private protocol BiCalculator {
    func calc(right: Int, left: Int) -> Int
}

private class CalcMachine {
    private let args: [(Int, Int)]
    private let calculator: BiCalculator
    init(args: [(Int, Int)], calculator: BiCalculator) {
        self.args = args
        self.calculator = calculator
    }
    func printAllResults() {
        for (x, y) in args {
            print("\(x) and \(y) are calculated to \(calculator.calc(right: x, left: y))")
        }
    }
}

private class Multiplyer: BiCalculator {
    func calc(right: Int, left: Int) -> Int {
        return right * left
    }
}

func executeCalclationsByProtocolType() {
    let args = [
        (2, 2), (10, 13), (973, 47)
    ]
    let calculator = Multiplyer()
    let machine = CalcMachine(args: args, calculator: calculator)
    machine.printAllResults()
}

//Delegation
//参考:「オブジェクト指向のこころ」P.163
private protocol Drawable {
    func draw()
}

private protocol Drawing {
    //引数の型はDrawableでもいいような気もする。
    //ただしこのシグネチャの方がDrawableとDrawingは疎結合になる。
    func drawLine(x1: Double, y1: Double, x2: Double, y2: Double)
    func drawCircle(x: Double, y: Double, r: Double)
}

//Javaの抽象クラスにあたるものが無いため，BaseShapeにDrawableを実装させようとすると
//空のdrawを実装する必要が出てきてしまう。
private class BaseShape: Drawable {
    //描画処理を委譲するためのDrawingオブジェクト
    //このクラスもサブクラスも描画処理の詳細を知る必要が無い。
    private let drawing: Drawing
    init(drawing: Drawing) {
        self.drawing = drawing
    }
    //コンパイルを通すためだけに書かれたメソッド
    //init以外にrequiredを指定することはできない。
    //overrideを付けるとコンパイルエラーになる。
    func draw() {}
    func drawLine(x1: Double, y1: Double, x2: Double, y2: Double) {
        drawing.drawLine(x1: x1, y1: y1, x2: x2, y2: y2)
    }
    func drawCircle(x: Double, y: Double, r: Double) {
        drawing.drawCircle(x: x, y: y, r: r)
    }
}

private class Rectangle: BaseShape {
    private let x1: Double
    private let y1: Double
    private let x2: Double
    private let y2: Double
    init(drawing: Drawing, x1: Double, y1: Double, x2: Double, y2: Double) {
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        //super.initは最後に書かないとコンパイルエラーにされることが多い？
        super.init(drawing: drawing)
    }
    override func draw() {
        drawLine(x1: x1, y1: y1, x2: x2, y2: y1)
        drawLine(x1: x2, y1: y1, x2: x2, y2: y2)
        drawLine(x1: x2, y1: y2, x2: x1, y2: y2)
        drawLine(x1: x1, y1: y2, x2: x1, y2: y1)
    }
}

private class Circle: BaseShape {
    private let x: Double
    private let y: Double
    private let r: Double
    init(drawing: Drawing, x: Double, y: Double, r: Double) {
        self.x = x
        self.y = y
        self.r = r
        super.init(drawing: drawing)
    }
    override func draw() {
        drawCircle(x: x, y: y, r: r)
    }
}

private class FastDrawing: Drawing {
    //protocolのメソッドを実装する際にoverrideを指定するとコンパイルエラーになる。
    func drawLine(x1: Double, y1: Double, x2: Double, y2: Double) {
        print("Drawing line fast!:x1=\(x1),y1=\(y1),x2=\(x2),y2=\(y2)")
    }
    func drawCircle(x: Double, y: Double, r: Double) {
        print("Drawing circle fast!:x=\(x),y=\(y),r=\(r)")
    }
}

private class QualityDrawing: Drawing {
    func drawLine(x1: Double, y1: Double, x2: Double, y2: Double) {
        print("Drawing line high quality!:x1=\(x1),y1=\(y1),x2=\(x2),y2=\(y2)")
    }
    func drawCircle(x: Double, y: Double, r: Double) {
        print("Drawing circle high quality!:x=\(x),y=\(y),r=\(r)")
    }
}

private enum DrawingError: Error {
    case unsupported(type: String)
}

private func createDrawing(type: String) throws -> Drawing {
    if type.lowercased() == "fast" {
        return FastDrawing()
    } else if type.lowercased() == "quality" {
        return QualityDrawing()
    } else {
        throw DrawingError.unsupported(type: type)
    }
}

func displayDelegationObjects() {
    do {
        let fastDrawing = try createDrawing(type: "fast")
        let qualityDrawing = try createDrawing(type: "quality")
        
        let rect = Rectangle(drawing: fastDrawing, x1: 1.0, y1: 1.0, x2: 2.0, y2: 2.0)
        rect.draw()
        let circle = Circle(drawing: qualityDrawing, x: 3.5, y: 4.5, r: 10.5)
        circle.draw()
        let circle2 = Circle(drawing: fastDrawing, x: 7.2, y: 3.9, r: 12.3)
        circle2.draw()
        
        let _ = try createDrawing(type: "real")
    } catch DrawingError.unsupported(let type) {
        print("\"\(type)\" is unsupported!")
    } catch {
        print("Drawing is failed.")
    }
}

//Adding Protocol Conformance with an Extension



