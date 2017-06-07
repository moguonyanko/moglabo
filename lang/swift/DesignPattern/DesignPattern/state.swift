//
//  state.swift
//  DesignPattern
//
//

import Foundation

private enum Mode {
    case standby, air, heat
}

private protocol Condition {
    func turn() -> Condition
    var stateInfo: String { get }
}

private extension Condition {
    func start(_ mode: Mode) -> Condition {
        switch mode {
        case .air:
            return AirConditioning()
        case .heat:
            return Heating()
        default:
            return self
        }
    }
    func stop() -> Condition {
        return StandBy()
    }
}

private class AirConditioning: Condition {
    func turn() -> Condition {
        return Heating()
    }
    var stateInfo: String {
        return "Air conditioning!"
    }
}

private class Heating: Condition {
    func turn() -> Condition {
        return AirConditioning()
    }
    var stateInfo: String {
        return "Heating!"
    }
}

private class StandBy: Condition {
    func turn() -> Condition {
        return self
    }
    var stateInfo: String {
        return "Stand by for conditioning"
    }
}

private class Room {
    private lazy var condition: Condition = StandBy()
    func startConditioner(_ mode: Mode) {
        self.condition = condition.start(mode)
    }
    func stopConditioner() {
        self.condition = condition.stop()
    }
    func turnConditionMode() {
        self.condition = condition.turn()
    }
    var description: String {
        return condition.stateInfo
    }
}

private func runAllCases() {
    let room = Room()
    print(room.description)
    room.startConditioner(.air)
    print(room.description)
    room.turnConditionMode()
    print(room.description)
    room.turnConditionMode()
    print(room.description)
    room.stopConditioner()
    print(room.description)
}

struct State {
    static func main() {
        print("***** State Pattern *****")
        runAllCases()
    }
}
