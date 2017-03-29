//
//  enumerations.swift
//  PracticeSwift
//
//  Enumerations practices
//

import Foundation

//Matching Enumeration Value with a Switch Statement
private enum Week: Int {
    case sunday = 1, monday, tuesday, wednesday, thursday, friday, saturday
}

private func printWeekDay(weekday: Week) {
    switch weekday {
    case .sunday:
        print("日曜日は休み")
    case .monday:
        print("月曜日")
    case .tuesday:
        print("火曜日")
    case .wednesday:
        print("水曜日")
    case .thursday:
        print("木曜日")
    case .friday:
        print("金曜日")
    case .saturday:
        print("土曜日")
//    default:
//        print("曜日不明")
    }
}

func matchEnumMembers() {
    printWeekDay(weekday: Week.tuesday)
}

//Associated Values
private enum Authentication {
    //型ごとにcaseを定義していく。
    case name(String)
    case id(String, Int)
}

private func matchAllAssociatedValues(_ auth: Authentication) {
    switch auth {
    case let .name(userName):
        print("Sample user name = \(userName)")
    case let .id(prefix, suffix):
        print("Sample user id = \(prefix)-\(suffix)")
    }
}

func displayAssociatedValues() {
    var auth = Authentication.name("Fuga")
    
    matchAllAssociatedValues(auth)
    
    auth = Authentication.id("ABC", 12345)
    
    matchAllAssociatedValues(auth)
}

//Implicitly Assigned Raw Values

//caseの型が全て同じであればenumの宣言に型を指定できる。
//この形で定義されたenumでなければrawValueを参照することができない。
private enum Name: String {
    case first, last
}

private enum Code: Int {
    //raw valueが指定されなかったcaseには自動的に連番が割り当てられる。
    case first = 1, second, third, tenth = 10, eleventh
}

func checkEnumRawValues() {
    print("Last name raw value = \(Name.last.rawValue)")
    print("Second code raw value = \(Code.second.rawValue)")
    print("Tenth code raw value = \(Code.tenth.rawValue)")
    print("Eleventh code raw value = \(Code.eleventh.rawValue)")
}

//Initializing from a Raw Value
private func getWeekDay(_ value: Int) -> Week? {
    return Week(rawValue: value)
}

func displayEnumByRawValue() {
    let number = 7
    
    if let someWeekDay = getWeekDay(number) {
        switch someWeekDay {
        case .saturday, .sunday:
            print("今日は休み")
        default:
            print("平日")
        }
    } else {
        print("\(number)に対応する曜日はありません。")
    }
}

//Recursive Enumerations

//enumが入れ子になっているときはindirectの指定が必須である。
private indirect enum ArithmeticExpression {
    case literal(Int)
    case addition(ArithmeticExpression, ArithmeticExpression)
    case subtract(ArithmeticExpression, ArithmeticExpression)
    case multiplication(ArithmeticExpression, ArithmeticExpression)
    case division(ArithmeticExpression, ArithmeticExpression)
}

private func evalExpression(_ expression: ArithmeticExpression) -> Int {
    switch expression {
    case let .literal(value):
        return value
    case let .addition(left, right):
        return evalExpression(left) + evalExpression(right)
    case let .subtract(left, right):
        return evalExpression(left) - evalExpression(right)
    case let .multiplication(left, right):
        return evalExpression(left) * evalExpression(right)
    case let .division(left, right):
        return evalExpression(left) / evalExpression(right)
    }
}

func calcByEnumExpression() {
    //(10 - 6) / 2
    let a = ArithmeticExpression.literal(10)
    let b = ArithmeticExpression.literal(6)
    let c = ArithmeticExpression.literal(2)
    
    let sub = ArithmeticExpression.subtract(a, b)
    let param = ArithmeticExpression.division(sub, c)
    
    print("(10 - 6) / 2 = \(evalExpression(param))")
}


