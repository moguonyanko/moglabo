//
//  dao.swift
//  DesignPattern
//
//

import Foundation

private struct Fruit: Equatable {
    let name: String
    let price: Int
    static func ==(lhs: Fruit, rhs: Fruit) -> Bool {
        return lhs.name == rhs.name && lhs.price == rhs.price
    }
    var description: String {
        return "\(name) is priced at \(price) yen"
    }
}

private var fruitDb = [
    "A101": Fruit(name: "lemon", price: 180),
    "A102": Fruit(name: "apple", price: 150),
    "A111": Fruit(name: "orange", price: 120),
    "B101": Fruit(name: "kiwi", price: 200),
    "B102": Fruit(name: "banana", price: 250)
]

private protocol FruitDao {
    func add(id: String, fruit: Fruit) throws
    func select(id: String) -> Fruit?
    func update(id: String, fruit: Fruit) throws
    func delete(id: String) -> Fruit?
    func delete(fruit: Fruit) -> Fruit?
    // function typeの引数にラベルが指定されていても呼び出す側で
    // dao.find { !$0.name.isEmpty }
    // といった短縮記法を使用することができる。
    func find(predicate: (_ fruit: Fruit) -> Bool) -> [Fruit]
}

private enum DaoError: Error {
    case duplicateRecord(id: String)
    case missingRecord(id: String)
}

private class FruitShop: FruitDao {
    func add(id: String, fruit: Fruit) throws {
        guard !fruitDb.keys.contains(id) else {
            throw DaoError.duplicateRecord(id: id)
        }
        fruitDb[id] = fruit
    }
    // 妥当なデフォルト値をAPI側で定義できる時はoptional typeを返さず
    // デフォルト値を返すようにする。定義できない時かつ例外をスローしない時は
    // nilを返せるようにするためにoptional typeを返す。
    func delete(fruit: Fruit) -> Fruit? {
        for (id, checkingFruit) in fruitDb {
            if fruit == checkingFruit {
                return self.delete(id: id)
            }
        }
        return nil
    }
    func delete(id: String) -> Fruit? {
        return fruitDb.removeValue(forKey: id)
    }
    func update(id: String, fruit: Fruit) throws {
        guard fruitDb.keys.contains(id) else {
            throw DaoError.missingRecord(id: id)
        }
        fruitDb[id] = fruit
    }
    func select(id: String) -> Fruit? {
        return fruitDb[id]
    }
    // 何も見つからなかった時は空の配列を返す。nilは返さない。
    func find(predicate: (Fruit) -> Bool) -> [Fruit] {
        return fruitDb.values.filter { predicate($0) }
    }
}

struct Dao {
    static func main() {
        let shop = FruitShop()
        let melon = Fruit(name: "melon", price: 1000)
        try? shop.add(id: "C101", fruit: melon)
        if let f1 = shop.delete(id: "A101") {
            print("Deleted:\(f1.description)")
        }
        if let f2 = shop.delete(fruit: Fruit(name: "orange", price: 120)) {
            print("Deleted:\(f2.description)")
        }
        try? shop.update(id: "B101", fruit: Fruit(name: "pineapple", price: 450))
        if let f3 = shop.select(id: "C101") {
            print("Selected:\(f3.description)")
        }
        //let f4 = shop.find({(fruit: Fruit) -> Bool in
        //    return fruit.price >= 200
        //})
        // 上のコードと同じ。
        let f4 = shop.find { $0.price >= 200 }
        f4.forEach { print("Found:\($0.description)") }
    }
}
