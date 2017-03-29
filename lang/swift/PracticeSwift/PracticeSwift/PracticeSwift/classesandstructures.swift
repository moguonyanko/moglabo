//
//  classesandstructures.swift
//  PracticeSwift
//
// Classes and Structures practices
//

import Foundation

//Comparing Classes and Structures
struct Dimension {
    var width = 0
    var height = 0
}

class View {
    var dimention = Dimension()
    var mode = "normal"
}

func dumpSampleClassProperties() {
    let view = View()
    print("View mode = \(view.mode)")
}

//Structures and Enumerations Are Vature Types

