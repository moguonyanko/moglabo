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
    // 具象的な型(ここではMyIterator)を書くことを強制されたりはしない。とはいえ
    // 抽象的な型を介してプログラムを記述することができていないことに変わりはない。
    // クライアントにはIteratableな部分だけを公開したいにも関わらず，実装の詳細を示す型を
    // 返さなければならなくなっている。
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
        // genericsのoptional typeを返してしまうと呼び出した側でunwrapできない。
        // optional typeを返せないのでイテレーション終了時にnilを返すことができない。
        // そこで終了時は例外をスローしている。
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
    while iterator.hasNext() {
        let element = try? iterator.next()
        print("\(element!)")
    }
}

// この関数では負の数を含む乱数を生成できない。
private func makeRandomUInts(max: UInt32, count: Int) -> [Int] {
    let mapper = {(element: UInt32) -> Int in
        let n = arc4random_uniform(element)
        return Int(n)
    }
    // 配列のサイズが負ということはありえず実際負の数を渡すと例外になるのだから
    // repeatingではなくcountこそUInt32であるべきではないだろうか。
    return Array(repeating: max, count: count).map(mapper)
}

// 負の数を含む乱数を生成できるバージョン
// TODO: 乱数の偏りが激しいように思える。
private func makeRandomInts(range: CountableClosedRange<Int>, count: Int) -> [Int] {
    let mapper = {(element: (absMinimum: Int, maximum: Int)) -> Int in
        let upperBound = UInt32(element.maximum + element.absMinimum)
        return Int(arc4random_uniform(upperBound)) - element.absMinimum
    }
    let absMin = abs(range.lowerBound)
    // maxの値も生成されるようにするため1を加えている。
    return Array(repeating: (absMin, range.upperBound + 1), count: count).map(mapper)
}

struct Iterator {
    static func main() {
        // スペースを除いて(-10...-1)とするとコンパイルエラーになる。
        // minをmaxより大きくしてもコンパイルエラーにはならず実行時エラーになる。
        let numbers = makeRandomInts(range: (-20 ... 0), count: 5)
        let numberCollection = MyCollection(numbers)
        let iterator = numberCollection.makeIterator()
        dumpIteratorElements(iterator)
        
        let collection2 = MyCollection(["H", "e", "l", "l", "o"])
        let iterator2 = collection2.makeIterator()
        dumpIteratorElements(iterator2)
        
        let collection3 = MyCollection([Double]())
        let iterator3 = collection3.makeIterator()
        dumpIteratorElements(iterator3)
    }
}
