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
private class NumberQuiz {
    static let name = "Observer Quiz"
    
    //読み取り専用でもcomputed propertyをletでは宣言できない。
    static var version: Double {
        return 1.0
    }
    
    static var history = [String]()
    
    //classを指定するとオーバーライドできるtype propertyになる。
    //オーバーライド可能なtype propertyにはwillSetとdidSetを定義することができない。
    class var memo: String {
        get {
            return history.joined(separator: ",")
        }
        set {
            //historyにstaticが無い，つまりインスタンスなメンバだったらコンパイルエラー
            history.append(newValue)
        }
    }
    
    static var info: String = "" {
        willSet {
            print("Change info to \(newValue)")
        }
        didSet {
            NumberQuiz.memo = oldValue
            print("Changed info from \(oldValue)")
        }
    }
    
    var rightAnswer = 0
    
    //プロパティに初期値が設定されていない場合，Initializerがないとコンパイルエラーになる。
    var answer: Int = 0 {
        willSet(newAnswer) {
            print("New answer = \(newAnswer)")
        }
        didSet {
            //oldValueはsetterで更新される前の値になっている。
            let oldDelta = abs(rightAnswer - oldValue)
            let nowDelta = abs(rightAnswer - answer)
            print("Old \(oldDelta) to right answer")
            print("Now \(nowDelta) to right answer")
        }
    }
}

func checkActionOfObservers() {
    let quiz = NumberQuiz()
    
    NumberQuiz.memo = "foo"
    NumberQuiz.memo = "bar"
    NumberQuiz.memo = "baz"
    
    print("Quiz name: \(NumberQuiz.name)")
    print("Quiz version: \(NumberQuiz.version)")
    print("Quiz memo: \(NumberQuiz.memo)")
    
    quiz.rightAnswer = 50
    
    quiz.answer = 10
    quiz.answer = 55
    quiz.answer = 50
    
    NumberQuiz.info = "Hello"
    NumberQuiz.info = "Good morning"
    NumberQuiz.info = "さようなら"
    print("One more quiz memo: \(NumberQuiz.memo)")
}

//Querying and Setting Type Properties
private struct Player {
    //このような設定値をこの手のクラスに持たせることは普通しない。あくまでもサンプル。
    static let limitScore = 100
    static var currentMaxScoreOfAllPlayers = 0
    var score: Int = 0 {
        didSet {
            if Player.limitScore < score {
                score = Player.limitScore
            }
            if Player.currentMaxScoreOfAllPlayers < score {
               Player.currentMaxScoreOfAllPlayers = score
            }
        }
    }
}

func changeTypeProperties() {
    var p1 = Player()
    var p2 = Player()
    
    p1.score = 10
    p2.score = 30
    
    print("Current max score: \(Player.currentMaxScoreOfAllPlayers)")
    
    p1.score = 120
    p2.score = 90
    
    print("Current max score: \(Player.currentMaxScoreOfAllPlayers)")
}















