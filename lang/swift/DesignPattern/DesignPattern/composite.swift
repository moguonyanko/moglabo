//
//  Composite.swift
//  DesignPattern
//
//

import Foundation

private protocol Key: Hashable {
    var value: String { get }
}

private protocol Painter {
    associatedtype K: Key
    func add(key: K, shape: Shape)
    func remove(key: K) -> Shape?
    func paint()
}

private protocol Shape {
    func draw()
}

private protocol Text: Shape {
    var textContent: String { get }
}

private protocol Point: Shape {
    var coords: (Double, Double) { get }
}

private protocol Rect: Shape {
    var points: [Point] { get }
}

private struct ShapeKey: Key {
    fileprivate var value: String
    fileprivate var hashValue: Int {
        return value.hashValue
    }
    static func ==(lhs: ShapeKey, rhs: ShapeKey) -> Bool {
        return lhs.value == rhs.value
    }
}

//実際は形状に描画メソッドを持たせるのではなく形状ごとのPainterが作られるべきである。
private struct TextElement: Text {
    fileprivate var textContent: String
    func draw() {
        print("drawing \(textContent)")
    }
}

private struct PointElement: Point {
    fileprivate var coords: (Double, Double)
    func draw() {
        print("drawing point at \(coords)")
    }
}

private struct Rect2D: Rect {
    fileprivate var points: [Point]
    func draw() {
        print("drawing rectangle by \(points.count) points")
        points.forEach { $0.draw() }
    }
}

private class Painter2D: Painter {
    private var shapes: [ShapeKey:Shape] = [:]
    func add(key: ShapeKey, shape: Shape) {
        shapes[key] = shape
    }
    func remove(key: ShapeKey) -> Shape? {
        return shapes.removeValue(forKey: key)
    }
    func paint() {
        shapes.keys.forEach { shapes[$0]?.draw() }
    }
}

struct Composite {
    static func main() {
        let painter = Painter2D()
        let point = PointElement(coords: (1.5, 2.0))
        painter.add(key: ShapeKey(value: "foo"), shape: point)
        let text = TextElement(textContent: "Hello, Text")
        painter.add(key: ShapeKey(value: "bar"), shape: text)
        let points = [
            PointElement(coords: (5.0, 4.0)),
            PointElement(coords: (5.0, 1.0)),
            PointElement(coords: (-3.5, -10.0)),
            PointElement(coords: (1.0, 4.5))
        ]
        let rect = Rect2D(points: points)
        painter.add(key: ShapeKey(value: "baz"), shape: rect)
        painter.paint()
    }
}
