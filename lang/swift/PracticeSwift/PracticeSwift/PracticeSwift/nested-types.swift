//
//  nested-type.swift
//  PracticeSwift
//
//  Nested Types Practices
//

import Foundation

//Nested Types in Action
//参考:EffectiveJava P.151
private struct Payroll {
    enum PayType: String {
        case weekDay = "平日", weekEnd = "週末"
        
        //stored propertyはenumに定義できない。
        private var hoursPerShift: Double {
            return 8.0
        }
        
        //enumにstructureやclassを定義することはできる。
        struct Bonus {
            let value: Int
        }
        
        private var bonusValue: Bonus {
            if self == .weekEnd {
                return Bonus(value: 5000)
            } else {
                return Bonus(value: 0)
            }
        }
        
        private func overtimePay(hours: Double, payRate: Double) -> Double {
            switch self {
            case .weekDay:
                return hours <= hoursPerShift ? 0 :
                    (hours - hoursPerShift) * payRate / 2
            case .weekEnd:
                return hours * payRate / 2
            }
        }
        
        func pay(hoursWorked: Double, payRate: Double) -> Double {
            let basePay = hoursWorked * payRate
            let overedPay = basePay + overtimePay(hours: hoursWorked, payRate: payRate)
            return overedPay + Double(bonusValue.value)
        }
    }
    
    enum PayrollDay: String {
        //enumのcase1つ1つがオブジェクト，といった感じではない。
        //caseにはrawValueを示すリテラルしか割り当てることができない。
        //またrawValueには重複は許されない。
        case monday = "月曜日", tuesday = "火曜日", wednesday = "水曜日",
            thursday = "木曜日", friday = "金曜日", saturday = "土曜日",
            sunday = "日曜日"
        
        //各caseにPayTypeを保持させる方法が不明なので，switch文による判定を行い
        //PayrollDayに応じたPayTypeを返している。
        func getPayType() -> PayType {
            switch self {
            case .monday, .tuesday, .wednesday, .thursday, .friday:
                return PayType.weekDay
            case .saturday, .sunday:
                return PayType.weekEnd
            }
        }
        
        func pay(hoursWorked: Double, payRate: Double) -> Double {
            let payType = getPayType()
            return payType.pay(hoursWorked: hoursWorked, payRate: payRate)
        }
    }
    
    let payrollDay: PayrollDay
    func calcPayroll(hoursWorked: Double, payRate: Double) -> Double {
        return payrollDay.pay(hoursWorked: hoursWorked, payRate: payRate)
    }
    var description: String {
        let payType = payrollDay.getPayType()
        return "本日は\(payrollDay.rawValue)(\(payType.rawValue))です。"
    }
}

func displayNestedTypeValues() {
    let payroll = Payroll(payrollDay: .friday)
    let result = payroll.calcPayroll(hoursWorked: 7.5, payRate: 700)
    print("\(payroll.description)給料は\(result)円です。")
    
    let weekEnd = Payroll.PayType.weekEnd.rawValue
    print("\"Weekend\" translate English to Japanese \"\(weekEnd)\"")
}
