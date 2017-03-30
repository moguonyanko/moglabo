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

class Viewer {
    var dimention = Dimension()
    var mode = "normal"
}

func dumpSampleClassProperties() {
    let viewer = Viewer()
    print("View mode = \(viewer.mode)")
}

//Structures and Enumerations Are Vature Types
func changeStructureProperties() {
    let dm = Dimension(width: 100, height: 200)
    
    var dm2 = dm
    
    dm2.width = 1000
    
    //コピー先の構造体のプロパティを変更しても，コピー元のプロパティは変更されない。
    print("Dimention 1 width = \(dm.width)")
    print("Dimention 2 width = \(dm2.width)")
}

private enum Direction {
    case top, bottom, right, left
}

func changeEnumerationValue() {
    var current = Direction.left
    
    let saved = current
    
    current = Direction.right
    
    //コピー元が参照するenumのプロパティを変更しても，コピー先のプロパティは変更されない。
    print("Current direction \(current) but saved direction \(saved)")
}

//Classes Are Reference Types
func changeClassProperties() {
    let viewer = Viewer()
    viewer.dimention = Dimension(width: 300, height: 400)
    viewer.mode = "special"
    
    let viewer2 = viewer
    viewer2.mode = "legacy"
    
    //クラスの場合はコピー先に行われた変更に合わせてコピー元のプロパティも変更される。
    //クラスのインスタンスが定数であってもそのプロパティは変更される。
    print("Viewer 1 mode is \(viewer.mode)")
}

//Identitiy Operators
func identicalToInstances() {
    let v1 = Viewer()
    let v2 = v1
    let v3 = Viewer()
    let v4 = Viewer()
    let v5 = v4
    v4.mode = "prototype"
    
    //==演算子はインスタンスの比較には使用できない。
    print("v1 === v2 : \(v1 === v2)")
    print("v1 === v3 : \(v1 === v3)")
    print("v3 === v4 : \(v3 === v4)")
    print("v4 !== v5 : \(v4 !== v5)")
}















