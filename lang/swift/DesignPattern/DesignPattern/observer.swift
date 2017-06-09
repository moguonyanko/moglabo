//
//  observer.swift
//  DesignPattern
//
//

import Foundation

private protocol Watchable {
    func register(watcher: Watcher)
}

private protocol Student: Watchable {
    var name: String { get }
    var talking: Bool { get }
    var running: Bool { get }
    func talk()
    func run()
    func apology()
}

private extension Student {
//extensionにdeinitを定義することはできない。
//    deinit {
//        print("\(name) is free")
//    }
}

private protocol Watcher {
    //weakはprotocolのプロパティ宣言に指定できない。
    var targets: [Student] { get }
    func watch(target: Student)
    func patrol()
}

private class StrictManager: Watcher {
    //lazyの有無はprotocolの要求を満たしているかどうかに影響を与えない。
    lazy var targets: [Student] = [Student]()
    func watch(target: Student) {
        targets.append(target)
    }
    func patrol() {
        targets.forEach { student in
            if student.talking || student.running {
                student.apology()
            }
        }
    }
    deinit {
        print("Finished management")
    }
}

private class JuniorStudent: Student {
    var talking: Bool = false
    var running: Bool = false
    var name: String
    init(name: String) {
        self.name = name
    }
    func register(watcher: Watcher) {
        watcher.watch(target: self)
    }
    func talk() {
        self.talking = true
    }
    func run() {
        self.running = true
    }
    func apology() {
        print("I am \(name).")
        if talking {
            print("\(name) was talking...")
        }
        if running {
            print("\(name) was running...")
        }
        print("I am sorry. Please don't hit me!")
        self.talking = false
        self.running = false
    }
    deinit {
        print("\(name) is free")
    }
}

private func runAllCases() {
    let foo = JuniorStudent(name: "foo")
    let bar = JuniorStudent(name: "bar")
    let manager = StrictManager()
    foo.register(watcher: manager)
    bar.register(watcher: manager)
    foo.run()
    bar.talk()
    bar.run()
    manager.patrol()
}

struct Observer {
    static func main() {
        runAllCases()
    }
}
