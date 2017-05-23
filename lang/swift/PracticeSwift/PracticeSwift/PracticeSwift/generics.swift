//
//  generics.swift
//  PracticeSwift
//
//  Generics practices
//

import Foundation

//Generic Functions
private func shiftToRight<T>(_ x: inout T, _ y: inout T, _ z: inout T) {
    swap(&x, &y)
    swap(&x, &z)
}

func operateByGenericFunction() {
    var ix = 1, iy = 2, iz = 3
    //引数がletで宣言されているとコンパイルエラーになる。
    shiftToRight(&ix, &iy, &iz)
    print("(x, y, z) = \(ix), \(iy), \(iz)")
    
    var sx = "A", sy = "B", sz = "C"
    shiftToRight(&sx, &sy, &sz)
    print("(x, y, z) = \(sx), \(sy), \(sz)")
}

//Generic Types
private struct Queue<V> {
    //extensionを定義しようとするとprivateを指定しにくくなる。
    var items = [V]()
    mutating func offer(_ value: V) {
        items.insert(value, at: 0)
    }
    mutating func poll() -> V {
        return items.removeFirst()
    }
}

func operateGenericCollection() {
    var queue = Queue<Int>()
    queue.offer(1)
    queue.offer(2)
    queue.offer(3)
    let v = queue.poll()
    print("Queue.poll: \(v)")
}

//Extending a Generic Type
private extension Queue {
    var lastElement: V? {
        return !items.isEmpty ? items[items.count - 1] : nil
    }
}

func operateWithExtendedGenericsType() {
    var q = Queue(items: [4.5, 5.5, 6.5])
    let _ = q.poll()
    let _ = q.poll()
    print("Last queue element is \(q.lastElement?.description ?? "not found")")
}

//Type Constraints in Action
private class User: Equatable {
    private let name: String
    private let id: Int
    init(name: String, id: Int) {
        self.name = name
        self.id = id
    }
    /// Returns a Boolean value indicating whether two values are equal.
    ///
    /// Equality is the inverse of inequality. For any values `a` and `b`,
    /// `a == b` implies that `a != b` is `false`.
    ///
    /// - Parameters:
    ///   - lhs: A value to compare.
    ///   - rhs: Another value to compare.
    static func ==(lhs: User, rhs: User) -> Bool {
        return lhs.name == rhs.name && lhs.id == rhs.id
    }
    var description: String {
        return "My name is \(name)"
    }
}

private func contain<T: Equatable>(of targetValue: T, in array: [T]) -> Bool {
    for value in array {
        //Userで演算子オーバーロードした==が使われる。
        if value == targetValue {
            return true
        }
    }
    return false
}

private struct Fruit {
    var name: String
}

func runConstrainedGenericsFunction() {
    let users = [
        User(name: "foo", id: 111),
        User(name: "bar", id: 555),
        User(name: "baz", id: 888)
    ]
    let target = User(name: "bar", id: 555)
    if contain(of: target, in: users) {
        print("User is found: \"\(target.description)\"")
    } else {
        print("User is not found")
    }
    
    //Fruitはcontainの型変数Tの上限であるEquatableに従って実装されていないので，
    //Fruitの配列をcontainに渡すことはできずコンパイルエラーになる。
    //let fruits = [ Fruit(name: "banana") ]
    //let _ = contain(of: Fruit(name: "banana"), in: fruits)
}

//Associated Types
//Associated Types in Action
private protocol Fleet {
    //associatedtypeに指定される型が実際に定義されているかどうかは考慮されない。
    associatedtype Ship
    mutating func assign(_ ship: Ship)
    var count: Int { get }
    subscript(i: Int) -> Ship { get }
}

private struct NamedFleet: Fleet {
    var ships = [String]()
    mutating func addShip(shipName: String) {
        ships.append(shipName)
    }
    //mutatingは関数にしか指定できない。
    mutating func removeLatestShip() -> String {
        return ships.removeLast()
    }
    var description: String {
        return ships.joined(separator: ",")
    }
    //protocolが要求する"Ship"型にここではStringを割り当てる。
    //typealiasは書かなくても型推論される。
    typealias Ship = String
    mutating func assign(_ ship: String) {
        self.addShip(shipName: ship)
    }
    var count: Int {
        return ships.count
    }
    subscript(i: Int) -> String {
        return ships[i]
    }
}

func displayTypeAliasResult() {
    var fleet = NamedFleet(ships: ["samidare", "yubari", "yura"])
    fleet.addShip(shipName: "murasame")
    fleet.addShip(shipName: "shigure")
    print("\(fleet.description), the sum is \(fleet.count) ships.")
    print("The second ship is \(fleet[1]).")
    print("Removed the latest ship: \(fleet.removeLatestShip()).")
}

private protocol Describable {
    var description: String { get }
}

//protocolのassociatedtypeで指定されている型と同じ名前のstructureを定義しても問題無い。
private struct Ship: Describable {
    var name: String
    var description: String {
        return name
    }
}

private struct GenericFleet<Element: Describable>: Fleet {
    var ships = [Element]()
    mutating func addShip(_ ship: Element) {
        ships.append(ship)
    }
    mutating func removeLatestShip() -> Element {
        return ships.removeLast()
    }
    //protocolのassociatedtypeで要求している型にElementを割り当てていることが明白なので
    //typealiasは書かなくてもコンパイルでき問題無く実行できる。
    mutating func assign(_ ship: Element) {
        self.addShip(ship)
    }
    var count: Int {
        return ships.count
    }
    subscript(i: Int) -> Element {
        return ships[i]
    }
    var description: String {
        let texts: [String] = ships.map { ship -> String in
            return ship.description
        }
        return texts.joined(separator: ",")
    }
}

func checkGenericTypedCollection() {
    let samidare = Ship(name: "samidare"),
        yubari = Ship(name: "yubari"),
        yura = Ship(name: "yura"),
        murasame = Ship(name: "murasame"),
        shigure = Ship(name: "shigure")
    //インスタンス生成時にパラメータを与えないと型推論できずコンパイルエラーになる。
    var fleet = GenericFleet(ships: [shigure, murasame, yura, yubari, samidare])
    fleet.addShip(Ship(name: "harusame"))
    print("\(fleet.description), the sum is \(fleet.count) ships.")
    print("The forth ship is \(fleet[3].description).")
    print("Removed the latest ship: \(fleet.removeLatestShip().description).")
}

//Extending an Existing Type to Specify an Associated Type



