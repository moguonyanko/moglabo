//
//  extensions.swift
//  PracticeSwift
//
//  Extensions
//

import Foundation

//Computed Properties
private extension Double {
    var square: Double {
        return pow(self, 2.0)
    }
    var cube: Double {
        return pow(self, 3.0)
    }
    var m: Double {
        return self
    }
    var dm: Double {
        return self * 10
    }
}

func calcByCustomExtension() {
    print("The square of 2.0 is \(2.0.square)")
    print("The cube of 2.0 is \(2.0.cube)")
    print("10.5 meters is \(10.5.dm) deci-meters")
}


















