//
//  initialization.swift
//  PracticeSwift
//
//  Initialization practices
//

import Foundation

//Initialization Parameters

private struct Angle {
//    private var radian: Double {
//        get {
//            //getterを定義してもprivateなプロパティには外部からアクセスできない。
//            return self.radian
//        }
//        set {
//            //setterが定義されなければinitでも値を設定できない。
//            self.radian = newValue
//        }
//    }
    private let radian: Double
    init(fromRadian radian: Double) {
        self.radian = radian
    }
    //引数名が異なれば異なるinitとみなされる。
    init(fromDegree degree: Double) {
        let pi = (Decimal.pi as NSDecimalNumber).doubleValue
        self.radian = degree * pi / 180
    }
    func getRadian() -> Double {
        return self.radian
    }
}

func displayInstancesByOverloadInit() {
    let degree = 90.0
    let ang1 = Angle(fromDegree: degree)
    let ang2 = Angle(fromRadian: 1.5)
    
    print("First angle radian from \(degree) degree = \(ang1.getRadian())")
    print("Second angle radian = \(ang2.getRadian())")
}






