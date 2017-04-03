//
//  properties.swift
//  PracticeSwift
//
//  Properties practices
//

import Foundation

//Lazy Stored Properties
private struct TargetImage {
    var imageName: String
}

private class ImageLoader {
    //lazyが指定されたプロパティは常にvarで宣言しなければならない。
    lazy var target = TargetImage(imageName: "sample.jpg")
    var options:[String] = []
}

func displayLazyProperties() {
    let loader = ImageLoader()
    loader.options.append("force")
    loader.options.append("recursive")
    
    print("loader options = \(loader.options.description)")
    print("loader target = \(loader.target.imageName)")
}

//Computed Properties
private struct Point {
    var x = 0, y = 0, z = 0
}

private struct Size {
    var x = 0, y = 0, z = 0
}

private struct Cube {
    var origin = Point()
    var size = Size()
    
    private func getCenter(origin: Int, size: Int) -> Int {
        return origin + (size / 2)
    }
    
    private func getOrigin(center: Int, size: Int) -> Int {
        return center - (size / 2)
    }
    
    var center: Point {
        get {
            let x = getCenter(origin: origin.x, size: size.x)
            let y = getCenter(origin: origin.y, size: size.y)
            let z = getCenter(origin: origin.z, size: size.z)
            
            return Point(x: x, y: y, z: z)
        }
        set {
            origin.x = getCenter(origin: newValue.x, size: size.x)
            origin.y = getCenter(origin: newValue.y, size: size.y)
            origin.z = getCenter(origin: newValue.z, size: size.z)
        }
    }
    
    //Computed propertyは読み込み専用だとしてもletで宣言できない。
    var volume: Int {
        return size.x * size.y * size.z
    }
}

func accessStructProperties() {
    var cube = Cube(origin: Point(x: 0, y: 0, z: 0),
                    size: Size(x: 10, y: 10, z: 10))
    
    //cubeがletで宣言されているとプロパティが可変でも変更できなくなる。
    cube.center = Point(x: 10, y: 15, z: 5)
    
    //読み込み専用プロパティに値を設定しようとするとコンパイルエラーになる。
    //cube.volume = 10
    
    print("Cube origin = (\(cube.origin.x), \(cube.origin.y), \(cube.origin.z))")
    print("Cubic volume = \(cube.volume)")
}

//Property Observers






