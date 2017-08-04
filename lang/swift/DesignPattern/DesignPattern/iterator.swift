//
//  iterator.swift
//  DesignPattern
//
//

import Foundation

private enum IterationError: Error {
    case stopIteration
}

private protocol Iteratable {
    associatedtype Element
    func hasNext() -> Bool
    func next() throws -> Element
}

private protocol ICollection {
    associatedtype IteratorType: Iteratable
    func makeIterator() -> IteratorType
}

private class MyCollection<E>: ICollection {
    private let elements: [E]
    init(_ elements: [E]) {
        self.elements = elements
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
        func hasNext() -> Bool {
            return index < self.collection.elements.count
        }
        // typealiasを書いても書かなくても結果は変わらない。
        //typealias Element = E?
        // エンクロージングクラスの型パラメータはネストクラス内部からでも参照可能。
        // propertyは例外をスローできない。
        func next() throws -> E {
            guard self.hasNext() else {
                throw IterationError.stopIteration
            }
            let value = self.collection.elements[index]
            index += 1
            return value
        }
    }
}

private func dumpIteratorElements<T: Iteratable>(_ iterator: T) {
    repeat {
        let element = try? iterator.next()
        print("\(element!)")
    } while iterator.hasNext()
}

// TODO: 負の数を含む乱数を生成できない。
private func makeRandomNumbers(max: UInt32, count: Int) -> [Int] {
    let mapper = {(element: UInt32) -> Int in
        let n = arc4random_uniform(element)
        return Int(n)
    }
    // 配列のサイズが負ということはありえず実際負の数を渡すと例外になるのだから
    // repeatingではなくcountこそUInt32であるべきではないだろうか。
    return Array(repeating: max, count: count).map(mapper)
}

struct Iterator {
    static func main() {
        let numbers = makeRandomNumbers(max: 100, count: 5)
        let numberCollection = MyCollection(numbers)
        let iterator = numberCollection.makeIterator()
        dumpIteratorElements(iterator)
        
        let collection2 = MyCollection(["H", "e", "l", "l", "o"])
        let iterator2 = collection2.makeIterator()
        dumpIteratorElements(iterator2)
    }
}
