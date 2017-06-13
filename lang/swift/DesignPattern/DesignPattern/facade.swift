//
//  facade.swift
//  DesignPattern
//
//

import Foundation

private protocol JSONable {
    var json: String { get }
}

private struct NameSystem: JSONable {
    private(set) var name: String
    //protocolに従うプロパティにprotocolには無いfileprivateを指定してもエラーにならない。
    //なおこのstructはprivateでありファイル外からはアクセスできないので指定する意味は無い。
    fileprivate var json: String {
        return "{ \"name\": \"\(name.capitalized)\" }"
    }
}

private struct AgeSystem: JSONable {
    private(set) var age: Int
    //internalを指定しても問題無い。
    internal var json: String {
        return "{ \"grown\": \(age >= 20) }"
    }
}

private struct ScoreCheckerSystem: JSONable {
    private(set) var score: Double
    //protocolはprivateだがpublicを指定することもできる。しかしprivateはエラーになる。
    public var json: String {
        return "{ \"passed\": \(score >= 70) }"
    }
}

private struct User {
    //private(set)で宣言されているのでstructure外部からの書き込みは不可能。
    private(set) var name: String
    private(set) var age: Int
    private(set) var score: Double
}

private struct UserInfomationFacade: JSONable {
    private let nameSystem: NameSystem
    private let ageSystem: AgeSystem
    private let scoreChecker: ScoreCheckerSystem
    init(user: User) {
        nameSystem = NameSystem(name: user.name)
        ageSystem = AgeSystem(age: user.age)
        scoreChecker = ScoreCheckerSystem(score: user.score)
    }
    var json: String {
        return "{ \"userinfomation\": [\(nameSystem.json), \(ageSystem.json), \(scoreChecker.json)] }"
    }
}

struct Facade {
    static func main() {
        let user = User(name: "Hoge", age: 29, score: 89.5)
        let facade = UserInfomationFacade(user: user)
        print(facade.json)
    }
}
