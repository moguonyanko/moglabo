//
//  enumerations.swift
//  PracticeSwift
//
//  Enumerations practices
//

import Foundation

//Matching Enumeration Value with a Switch Statement
private enum Week {
    case sunday, monday, tuesday, wednesday, thursday, friday, saturday
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









