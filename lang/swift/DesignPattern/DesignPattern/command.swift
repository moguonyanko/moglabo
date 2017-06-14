//
//  command.swift
//  DesignPattern
//
//

import Foundation

private typealias Order = () -> String

private struct NumPrinter {
    func display(message: String) {
        print(message)
    }
}

private class OrderInvoker {
    private lazy var orders = [Order]()
    private var orderIndex = 0
    private let printer: NumPrinter
    init(printer: NumPrinter) {
        self.printer = printer
    }
    //@autoclosureはFunction型の引数にしか指定できない。
    //引数の型をOrderした場合，Function型の別名であるにも関わらず
    //@autoclosureを指定することはできない。
    func addOrder(_ order: @autoclosure @escaping () -> String) {
        //typealiasの右辺の型で参照される値をtypealiasの型の値として扱うことができる。
        //「実際の型->型の別名」の逆引きもできるということ。
        //意図せず逆引きされてしまうことを避けるには単純な型に対しては
        //typealiasを使わない方が良いのかもしれない。
        orders.append(order)
    }
    func execute(_ prefix: String = "") {
        if orderIndex < orders.count {
            let order = orders[orderIndex]
            next()
            let result = order()
            printer.display(message: prefix + result)
        } else {
            print("no order")
        }
    }
    private func back() {
        if orderIndex - 1 >= 0 {
            orderIndex -= 1
        }
    }
    private func next() {
        if orderIndex + 1 <= orders.count {
            orderIndex += 1
        }
    }
    func undo() {
        back()
        execute("UNDO:")
    }
    //redoは正常に動作していない。
    //backされたorderは別に保持するべき？
    func redo() {
        execute("REDO:")
    }
}

struct Command {
    static func main() {
        let invoker = OrderInvoker(printer: NumPrinter())
        let messages = [
            "Hello, world!",
            "How are you?",
            "This is coffee.",
            "I like Swift.",
            "Good Bye"
        ]
        print(messages)
        messages.forEach { invoker.addOrder($0) }
        invoker.execute()
        invoker.execute()
        invoker.undo()
        invoker.redo()
        invoker.undo()
        invoker.redo()
        invoker.execute()
    }
}
