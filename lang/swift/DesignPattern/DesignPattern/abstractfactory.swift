//
//  abstractfactory.swift
//  DesignPattern
//
//

import Foundation

private protocol RobotArm {
    func attack()
}

private protocol RobotBody {
    func defend()
}

private protocol Robot {
    var arm: RobotArm { get }
    var body: RobotBody { get }
    init(arm: RobotArm, body: RobotBody)
}

private protocol RobotFactory {
    func create() -> Robot
    init()
}

private struct RobotFactoryProvider {
    static func newFactory<T: RobotFactory>(robotType: T.Type) -> T {
        //RobotFactory protocolのinitが宣言されていないとコンパイルエラーになる。
        return robotType.init()
    }
}

private extension Robot {
    func attack() {
        arm.attack()
    }
    func defend() {
        body.defend()
    }
}

//以下にprotocolに従ってオブジェクトを生成するコードを記述しているが，本来であれば
//これらの具象的な実装はprotocolのような抽象的なコードとは別のサブモジュールとして
//分離されているべきである。

private struct IronRobot: Robot {
    var arm: RobotArm
    var body: RobotBody
}

private struct WoodRobot: Robot {
    var arm: RobotArm
    var body: RobotBody
}

private struct IronRobotArm: RobotArm {
    func attack() {
        print("Iron arm attack")
    }
}

private struct WoodRobotArm: RobotArm {
    func attack() {
        print("Wood arm attack")
    }
}

private struct IronRobotBody: RobotBody {
    func defend() {
        print("Iron body defence")
    }
}

private struct WoodRobotBody: RobotBody {
    func defend() {
        print("Wood body defence")
    }
}

private struct IronRobotFactory: RobotFactory {
    func create() -> Robot {
        return IronRobot(arm: IronRobotArm(), body: IronRobotBody())
    }
}

private struct WoodRobotFactory: RobotFactory {
    func create() -> Robot {
        return WoodRobot(arm: WoodRobotArm(), body: WoodRobotBody())
    }
}

private func testRobot<T: RobotFactory>(_ robotType: T.Type) {
    let factory = RobotFactoryProvider.newFactory(robotType: robotType)
    let robot = factory.create()
    robot.attack()
    robot.defend()
}

struct AbstractFactory {
    static func main() {
        //Factoryを生成するメソッドの引数は設定ファイルやデータベースまたは
        //動作環境の種別を元に得るのが妥当である。
        testRobot(IronRobotFactory.self)
        testRobot(WoodRobotFactory.self)
    }
}
