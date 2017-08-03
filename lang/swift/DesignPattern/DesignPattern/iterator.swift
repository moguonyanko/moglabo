//
//  iterator.swift
//  DesignPattern
//
//

import Foundation

private protocol Iteratable {
    associatedtype Element
    var done: Bool { get }
    var next: Element { get }
}

private protocol ICollection {
    associatedtype IteratorType: Iteratable
    func makeIterator() -> IteratorType
}

private class MyCollection<E>: ICollection {
    private let numbers: [E]
    init(numbers: [E]) {
        self.numbers = numbers
    }
    // Iteratableはassociatedtypeを利用しているのでmakeIteratorの戻り値の型に
    // Iteratableと書くことはできない。ただし型推論が効くためメソッドを呼び出した側で
    // 具象的な型(ここではMyIterator)を書くことを強制されたりはしない。
    func makeIterator() -> MyIterator {
        return MyIterator(collection: self)
    }
    // ネストクラスにstaticを指定することはできない。
    // Javaと異なりSwiftではネストクラスからエンクロージングクラスのプロパティを
    // 直接参照できない。
    class MyIterator: Iteratable {
        // ネストされたクラスからエンクロージングしているクラスのプロパティを参照するため，
        // エンクロージングクラスのインスタンスをstored propertyとして保持している。
        private let collection: MyCollection
        var index = 0
        init(collection: MyCollection) {
            self.collection = collection
        }
        var done: Bool {
            return index >= self.collection.numbers.count
        }
        // typealiasを書いても書かなくても結果は変わらない。
        //typealias Element = E?
        var next: E? {
            if !self.done {
                let value = self.collection.numbers[index]
                index += 1
                return value
            } else {
                return nil
            }
        }
    }
}

struct Iterator {
    static func main() {
        let numbers = Array(repeating: 100, count: 10).map {
            arc4random_uniform($0)
        }
        let collection = MyCollection(numbers: numbers)
        let iterator = collection.makeIterator()
        repeat {
            print("\(iterator.next!)")
        } while !iterator.done
    }
}
