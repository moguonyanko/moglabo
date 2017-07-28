//
//  memento.swift
//  DesignPattern
//
//

import Foundation

private enum LineState: String {
    case solid, dash, dot
}

// Memento
private struct Pen {
    private(set) var state: LineState
    init(state: LineState) {
        self.state = state
    }
}

// Originator
private class Writer {
    private var state: LineState = .solid
    func setState(state: LineState) {
        self.state = state
    }
    func save() -> Pen {
        return Pen(state: state)
    }
    func restore(pen: Pen) {
        self.state = pen.state
    }
    func writeLine() {
        print("Writing line by \"\(state.rawValue)\"")
    }
}

// Caretaker
private class PenCaretaker {
    private var pens = [Pen]()
    func addPen(_ pen: Pen) {
        pens.append(pen)
    }
    func getPen() -> Pen? {
        return pens.removeFirst()
    }
}

struct Memento {
    static func main() {
        let caretaker = PenCaretaker()
        let writer = Writer()
        writer.writeLine()
        writer.setState(state: .dash)
        writer.writeLine()
        caretaker.addPen(writer.save())
        writer.setState(state: .dot)
        writer.writeLine()
        if let pen = caretaker.getPen() {
            writer.restore(pen: pen)
            writer.writeLine()
        }
    }
}
