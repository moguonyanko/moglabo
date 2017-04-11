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
        let pi = NSDecimalNumber(decimal: Decimal.pi).doubleValue
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

//Initializer Parameters Without Argument Labels
private struct Student {
    private let name: String
    private let score: Int
    private static let defaultMemo = "none"
    //String?型だがletで宣言しているため初期化が強制される。
    private let memo: String?
    init(name: String, score: Int, memo: String?) {
        self.name = name
        self.score = score
        self.memo = memo ?? Student.defaultMemo
    }
    init(name: String, score: Int) {
        self.init(name: name, score: 0, memo: Student.defaultMemo)
    }
    //init(name: String, score: Int)と衝突せずコンパイルされ呼び出せる。
    init(_ name: String, _ score: Int) {
        self.init(name: name, score: score)
    }
    init(name: String) {
        self.init(name: name, score: 0)
    }
    var description: String {
        get {
            //memoはString?型なのでletで宣言されていてもデフォルト値の提供を要求される。
            return "\(name) got score is \(score) and \(memo ?? Student.defaultMemo)"
        }
    }
}

func checkInitlabels() {
    let s1 = Student(name: "Hoge", score: 100)
    let s2 = Student(name: "Fuga")
    let s3 = Student("Mike", 50)
    let s4 = Student(name: "Hoge", score: 100, memo: "sample instance")
    
    print(s1.description)
    print(s2.description)
    print(s3.description)
    print(s4.description)
}

//Default Initializer
private class AuthenticationInfo {
    //nilを受け付ける型ではなく初期化されていないプロパティがあったら
    //デフォルトのinitは提供されずコンパイルエラーになる。
    private var name = "anonymous"
    private var password: String?
    
    var description: String {
        get {
            return "\(name):\(password ?? "no password")"
        }
    }
}

private struct MyRectangle {
    //privateで宣言するとこのstructure外で初期化できずエラーになる。
    let width: Double, height: Double
    //String?型だがこのstructureの初期化時にmemoの初期値の指定は必須である。
    var memo: String?
    
    var description: String {
        get {
            return "This rectangle width = \(width), height = \(height), \(memo ?? "none")"
        }
    }
}

func printDefaultInitInstance() {
    let auth = AuthenticationInfo()
    print("\(auth.description)")
    
    //structureは自動的にプロパティに対応した引数を受ける初期化子が定義される。
    //ただし各プロパティはstructure外からアクセスできる必要がある。
    let rect = MyRectangle(width: 10.0, height: 12.5, memo: "hogehoge")
    print(rect.description)
}

//Initializer Delegation for Value Types
private struct Point2D {
    //初期値が与えられていないとPoint2d()の呼び出しはエラーになる。
    var x = 0.0
    var y = 0.0
    var description: String {
        get {
            return "(\(x),\(y))"
        }
    }
}

private struct Circle {
    var center = Point2D()
    var radius = 0.0
    
    init() {}
    
    init(center: Point2D, radius: Double) {
        self.center = center
        self.radius = radius
    }
    
    init(bottomLeft: Point2D, topRight: Point2D, radius: Double) {
        let centerX = (topRight.x - bottomLeft.x) / 2
        let centerY = (topRight.y - bottomLeft.y) / 2
        let p = Point2D(x: centerX, y: centerY)
        //他のinit呼び出しがinitの先頭でなくてもよい。
        self.init(center: p, radius: radius)
    }
    
    init(topLeft: Point2D, bottomRight: Point2D, radius: Double) {
        let centerX = (bottomRight.x - topLeft.x) / 2
        let centerY = (bottomRight.y - topLeft.y) / 2
        let p = Point2D(x: centerX, y: centerY)
        self.init(center: p, radius: radius)
    }
    
    var description: String {
        get {
            return "center = \(center.description), radius = \(radius)"
        }
    }
}

func displayInstancesByValueTypeInitializers() {
    let c1 = Circle()
    let c2 = Circle(center: Point2D(x: 1.0, y:2.0), radius: 5.5)
    let c3 = Circle(bottomLeft: Point2D(x: 3.0, y: 3.0),
                    topRight: Point2D(x: 7.0, y: 7.0), radius: 10.0)
    //より引数名が合致する方のinitが呼び出される。
    let c4 = Circle(topLeft: Point2D(x: 6.0, y: 14.0),
                    bottomRight: Point2D(x: 10.0, y: 8.0), radius: 4.0)
    
    print(c1.description)
    print(c2.description)
    print(c3.description)
    print(c4.description)
}









