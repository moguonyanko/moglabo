//
//  mediator.swift
//  DesignPattern
//
//

import Foundation

private struct Order {
    let player: Player
    let content: String
}

// Mediator
private class Manager {
    private lazy var players = [Player]()
    func inform(order: Order) {
        players.forEach {
            // Orderを生成したPlayerにはreceiveしない。
            // このような「やり取りの制御」を行うコードを複数の各オブジェクト(ここではPlayer)に
            // 分散させることなく一元管理するのがMediatorの目的の一つである。
            if order.player != $0 {
                $0.receive(order: order)
            }
        }
    }
    func addPlayers(_ players: [Player]) {
        self.players.append(contentsOf: players)
    }
}

private struct Player: Equatable {
    let name: String
    let manager: Manager
    init(name: String, manager: Manager) {
        self.name = name
        self.manager = manager
    }
    func send(content: String) {
        print("This is \(name), \"\(content)\"")
        let order = Order(player: self, content: content)
        manager.inform(order: order)
    }
    func receive(order: Order) {
        print("\"\(order.content)\": \(name) OK!")
    }
    static func ==(lhs: Player, rhs: Player) -> Bool {
        return lhs.name == rhs.name
    }
}

struct Mediator {
    static func main() {
        let manager = Manager()
        let p1 = Player(name: "Foo", manager: manager)
        let p2 = Player(name: "Bar", manager: manager)
        let p3 = Player(name: "Baz", manager: manager)
        manager.addPlayers([p1, p2, p3])
        p1.send(content: "Run fast!")
        p2.send(content: "Stop on the spot!")
        p3.send(content: "Go straight!")
    }
}
