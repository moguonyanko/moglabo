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
    //ここで指定するアクセスレベル修飾子はprotocolで指定された修飾子と一致していなくてもよい。
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
    var coords: [(Double, Double)] { get }
}

private protocol Drawing {
    //引数の型はDrawableでもいいような気もする。
    //ただしこのシグネチャの方がDrawableとDrawingは疎結合になる。
    func drawLine(x1: Double, y1: Double, x2: Double, y2: Double)
    func drawCircle(x: Double, y: Double, r: Double)
}

//Javaの抽象クラスにあたるものが無いため，BaseShapeにDrawableを実装させようとすると
//空のdrawを実装する必要が出てきてしまう。
//しかしSwiftではサブクラスが各々protocolを実装する方が良いのかもしれない。
//そうする利点としては以下の点が挙げられる。
//・そのclassがprotocolを実装していることが明白になる。
//・そのclassがそのprotocolの型で参照できることが明確になる。
//・実装を強制したい抽象的なコードと実装された具象的なコードがprotocolとclassで明確に分かれる。
private class BaseShape {
    //描画処理を委譲するためのDrawingオブジェクト
    //このクラスもサブクラスも描画処理の詳細を知る必要が無い。
    private let drawing: Drawing
    init(drawing: Drawing) {
        self.drawing = drawing
    }
    func drawLine(x1: Double, y1: Double, x2: Double, y2: Double) {
        drawing.drawLine(x1: x1, y1: y1, x2: x2, y2: y2)
    }
    func drawCircle(x: Double, y: Double, r: Double) {
        drawing.drawCircle(x: x, y: y, r: r)
    }
}

//extensionで定義したメソッドをサブクラスでオーバーライドすることはできない。
//つまりextensionをJavaの抽象クラスのように使うことはできない。
//extension BaseShape: Drawable {
//    func draw() {}
//}

private class Rectangle: BaseShape, Drawable {
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
    func draw() {
        drawLine(x1: x1, y1: y1, x2: x2, y2: y1)
        drawLine(x1: x2, y1: y1, x2: x2, y2: y2)
        drawLine(x1: x2, y1: y2, x2: x1, y2: y2)
        drawLine(x1: x1, y1: y2, x2: x1, y2: y1)
    }
    var coords: [(Double, Double)] {
        return [(x1, y1), (x2, y2)]
    }
}

private class Circle: BaseShape, Drawable {
    private let x: Double
    private let y: Double
    private let r: Double
    init(drawing: Drawing, x: Double, y: Double, r: Double) {
        self.x = x
        self.y = y
        self.r = r
        super.init(drawing: drawing)
    }
    func draw() {
        drawCircle(x: x, y: y, r: r)
    }
    var coords: [(Double, Double)] {
        return [(x, y)]
    }
    var radius: Double {
        return r
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
private protocol CoordsInspecter {
    var inspectCoords: String { get }
}

//次のようにprotocolに対してextensionを定義することはできない。
//extension Drawable: CoordsInspecter {}
//
//またprotocolを実装するextensionにはprivateを指定できない。
//以下はコンパイルエラーである。
//private extension Rectangle: CoordsInspecter {}
extension Rectangle: CoordsInspecter {
    var inspectCoords: String {
        return "Coords=\(coords)"
    }
}

extension Circle: CoordsInspecter {
    var inspectCoords: String {
        return "Coords=\(coords) and radius=\(radius)"
    }
}

func dumpResultsByExtensionProtocol() {
    if let fastDrawing = try? createDrawing(type: "fast") {
        let rect = Rectangle(drawing: fastDrawing, x1: 4.0, y1: 3.5, x2: 2.0, y2: 5.5)
        let circle = Circle(drawing: fastDrawing, x: 6.0, y: 1.0, r: 13.5)
        print(rect.inspectCoords)
        print(circle.inspectCoords)
    } else {
        print("Drawing shapes is failed.")
    }
}

//Declaring Protocol Adoption with an Extension
private struct Triangle {
    var coords: [(Double, Double)]
    var inspectCoords: String {
        return "This triangle coords=\(coords)"
    }
}

//CoordsInspecterで定義したメソッドが既にTriangleには実装されているので
//extensionの中身は空でよい。というよりメソッドを実装しようとすると再定義しよう
//としているとしてコンパイルエラーになってしまう。
extension Triangle: CoordsInspecter {
//    var inspectCoords: String {
//        return ""
//    }
}

func checkProtocolAdoptionObject() {
    let coords = [(0, 0), (3.0, 3.0), (7.5, 10.5)]
    let triangle = Triangle(coords: coords)
    //Triangleに実装されている，CoordsInspecterのメソッドと同じ定義のメソッドを，
    //CoordsInspecter型の変数にTriangleオブジェクトを代入することで取り入れる。
    //CoordsInspecter型であることを明記しなければ型推論でTriangle型になる。
    let inspection: CoordsInspecter = triangle
    //実体はTriangleだがCoordsInspecter型でオブジェクトが保持されているため
    //inspectCoordsプロパティしか参照できない。
    print(inspection.inspectCoords)
}

//Collections of Protocol Types
func displayCollectionPropertiesByProtocolTypes() {
    let rectangle = Rectangle(drawing: FastDrawing(), x1: 1.0, y1: 5.0,
                              x2: 5.0, y2: -1.0)
    let circle = Circle(drawing: QualityDrawing(), x: 5.5, y: 7.0, r: 12.5)
    let triangle = Triangle(coords: [(3.0, 2.0), (1.0, 5.0), (4.5, -3.5)])
    let coords: [CoordsInspecter] = [rectangle, circle, triangle]
    for coord in coords {
        print(coord.inspectCoords)
    }
}

//Protocol Inheritance
private protocol PrettyCoordsInspecter: CoordsInspecter {
    var coordsDescription: String { get }
}

extension Rectangle: PrettyCoordsInspecter {
    var coordsDescription: String {
        return "This rectangle is consisted by \(inspectCoords)"
    }
}

func checkInheritedProtocol() {
    if let drawing = try? createDrawing(type: "fast") {
        //1.1や2.3は近似値になってしまう。descriptionを参照すると最初に渡した値が文字列として得られる。
        let rect = Rectangle(drawing: drawing, x1: 1.1, y1: 5.5, x2: 3.0, y2: 2.3)
        print(rect.coordsDescription)
    }
}

//Class-Only Protocols
private protocol ClassCoordsInspacter: class, CoordsInspecter {
    var classCoords: [(Double, Double)] { get }
}

//ClassCoordsInspacterはclass限定で実装可能なprotocolなので
//Pointをstructureにするとコンパイルエラーになる。
private class Point: ClassCoordsInspacter {
    var point: [(Double, Double)]
    init(point: [(Double, Double)]) {
        self.point = point
    }
    var inspectCoords: String {
        return "Coords=\(point)"
    }
    var classCoords: [(Double, Double)] {
        return point
    }
}

func checkClassOnlyProtocol() {
    let p = Point(point: [(3.7, 2.1)])
    //tupleの各要素にアクセスするにはtuple.0やtuple.1といった方法を用いる。
    print("\(p.classCoords[0].0.description), \(p.classCoords[0].1.description)")
}

//Protocol Composition
private protocol Fired {
    //var power: Int { get }
    var fireForce: Int { get }
}

private protocol Torpedoed {
    //var power: Int { get }
    var torpedoPower: Int { get }
}

private struct Ship: Fired, Torpedoed {
    //実装するprotocolが2つあってもそれらに定義されているプロパティの名前や型が
    //全く等しい場合，実装するプロパティは1つだけになってしまう。
    //var power: Int
    var fireForce: Int
    var torpedoPower: Int
}

private func calcNightPower(_ ship: Fired & Torpedoed) -> Int {
    return ship.fireForce + ship.torpedoPower
}

func checkMultiProtocolObjects() {
    let ship = Ship(fireForce: 70, torpedoPower: 150)
    let nightPower = calcNightPower(ship)
    print("The ship has night power \(nightPower)")
}

//Checking for Protocol Conformance
private class Person {
    let name: String
    let age: Int
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }
    var description: String {
        return "\(name) is \(age) years old."
    }
}

func checkProtocolTypes() {
    let rectangle = Rectangle(drawing: QualityDrawing(),
                              x1: 1.2, y1: 3.4, x2: 5.6, y2: 7.8)
    let circle = Circle(drawing: FastDrawing(), x: 10.5, y: 12.0, r: 3.0)
    let person = Person(name: "Fuga", age: 31)
    let objects: [AnyObject] = [
        rectangle, circle, person
    ]
    for object in objects {
        //可能ならobjectは右辺に指定したprotocolの型にキャストされる。
        if let drawableObject = object as? Drawable {
            drawableObject.draw()
        } else if let person = object as? Person {
            print("\(person.description)")
        } else {
            print("Unknown object!")
        }
    }
}

private let sampleDatas = [
    "en": "Hello",
    "ja": "こんにちは",
    "de": "Guten Tag"
]

//Optional Protocol Requirements
@objc private protocol DataManager {
    @objc optional func find(hint: String) -> String
    @objc optional var defaultValue: String { get }
}

private class DataClient {
    private let manager: DataManager?
    init(manager: DataManager) {
        self.manager = manager
    }
    func printData(hint: String) {
        if let result = manager?.find?(hint: hint) {
            print("\"\(hint)\" associated \"\(result)\"")
        } else if let result = manager?.defaultValue {
            print("Found default value \"\(result)\"")
        }
    }
}

@objc private class IncompetentDataManager: NSObject, DataManager {
    var defaultValue = "…?…!…!?"
}

//optional protocolを実装するclassに@objcやNSObjectを書かなくてもエラーにならない。
//ただし@objcだけ指定して:の後にNSObjectを書かないとコンパイルエラーになる。
private class CompetentDataManager: DataManager {
    func find(hint: String) -> String {
        if let result = sampleDatas[hint] {
            return result
        } else {
            return "None by '\(hint)'"
        }
    }
}

func displayResultByOptionalProtocols() {
    let client1 = DataClient(manager: IncompetentDataManager())
    client1.printData(hint: "ja")
    let client2 = DataClient(manager: CompetentDataManager())
    client2.printData(hint: "ja")
    client2.printData(hint: "hoge")
}

//Protocol Extensions
private struct Location {
    var name: String
    var point: (Double, Double)
}

private protocol Travel {
    //computed propertyになるのでletを指定することはできない。
    //privateにすることもできない。
    var from: Location { get }
    var to: Location { get }
}

private extension Travel {
    var distance: Double {
        let deltaX = abs(to.point.0 - from.point.0)
        let deltaY = abs(to.point.1 - from.point.1)
        return sqrt(pow(deltaX, 2.0) + pow(deltaY, 2.0))
    }
}

private class ForeignTravel: Travel {
    var from: Location
    var to: Location
    init(from: Location, to: Location) {
        self.from = from
        self.to = to
    }
    var description: String {
        return "This travel planed from \(from.name) to \(to.name)"
    }
}

func displayExtentedProtocolResults() {
    let to = Location(name: "hogeCity", point: (1.0, 5.0))
    let from = Location(name: "fooTown", point: (210.5, -350.0))
    let travel = ForeignTravel(from: from, to: to)
    print(travel.description)
    print(travel.distance)
}

//Providing Default Implementations
private protocol Named {
    var name: String { get }
}

//protocolを実行する全てのclassやstructureに対して新しい振る舞いを提供する場合は
//protocolに対してextensionを定義する。例えばprotocolにデフォルトの振る舞いを定義する場合等。
private extension Named {
    var defaultName: String {
        return name
    }
}

private struct SampleName { }

//個々の型に対して振る舞いを追加したいのであれば，その型に対してextensionを定義する。
extension SampleName: Named {
    var name: String {
        return "no name"
    }
    var defaultName: String {
        return name
    }
}

//Adding Constraints to Protocol Extensions
//whereでextensionの対象に制限を設ける場合はextensionをprivateにすることができる。
//以下の例で示すextensionは「Collectionに対するextensionを定義する。
//ただしNamedに従っているIterator.ElementのCollectionに限定する。」と解釈できる。
private extension Collection where Iterator.Element: Named {
    func dumpAllNames(separator: String) -> String {
        let names = self.map { $0.name }
        return names.joined(separator: separator)
    }
}

private struct SampleClient: Named {
    var name: String
}

private struct Student {
    var name: String
}

func displayResultByConstrainedProtocol() {
    let clients = [
        SampleClient(name: "fuga"),
        SampleClient(name: "hoge"),
        SampleClient(name: "poko")
    ]
    print(clients.dumpAllNames(separator: "-"))
    
    let students = [
        Student(name: "foo"), Student(name: "bar"), Student(name: "baz")
    ]
    
    //studentsはNamedに従っていないstructureのCollectionなので
    //dumpAllNamesメソッドを参照することができない。
    //print(students.dumpAllNames(separator: ","))
    print(students.map { $0.name }.joined(separator: ","))
}
