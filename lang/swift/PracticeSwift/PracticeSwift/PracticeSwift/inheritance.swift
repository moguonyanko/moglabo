//
//  inheritance.swift
//  PracticeSwift
//
//  Inheritance practices
//

import Foundation

//Subclassing
private class Aircraft {
    private let name: String
    private let boost: Int
    var baseSpeed = 10.0
    
    init(name: String, boost: Int) {
        //nameが読み取り専用プロパティだったらinit内の代入でもエラーになる。
        self.name = name
        self.boost = boost
    }
    
    //Computed propertyはvarで宣言されたプロパティにしか定義できない。
    //letで宣言されたプロパティにアクセスしたければ明示的にアクセッサメソッドを定義する。
    final func getName() -> String {
        return self.name
    }
    
    func getBoost() -> Int {
        return self.boost
    }
    
    //このget・set内でspeedを参照する時selfが付いていなければコンパイルエラーになる。
    //selfを付ければコンパイルできるが実行時にBAD_ACCESSとなり結局エラーになる。
    var speed: Double {
        get {
            return baseSpeed * Double(getBoost())
        }
        set {
            baseSpeed = newValue
        }
    }
    
    var description: String {
        return "\(name) speed is \(speed) km/h"
    }
}

private class FastAircraft: Aircraft {
    private var power: Int = 0
    
    override init(name: String, boost: Int) {
        //powerに初期値が与えられていなければエラー
        //Int型を指定していても0で初期化されない。
        super.init(name: name, boost: boost)
    }
    
    convenience init(name: String, boost: Int, power: Int) {
        self.init(name: name, boost: boost)
        //powerがletで宣言されているとエラー
        //convenienceなinit内では定数に値を代入することができない。
        //self.initより前に記述するとエラーになる。
        self.power = power
    }
    
    override func getBoost() -> Int {
        return super.getBoost() * power
    }
    
    override var speed: Double {
        willSet {
            self.baseSpeed += Double(power)
        }
    }
}

private class DamagedAircraft: Aircraft {
    private var damageLevel: Int = 5
    
    //super classのinitとシグネチャが異なるのでoverrideを付けるとエラーになる。
    init(name: String, boost: Int, damageLevel: Int) {
        self.damageLevel = damageLevel
        //super classのinit呼び出しがinitの先頭でなくてもエラーにならない。
        super.init(name: name, boost: boost / damageLevel)
    }
    
    override func getBoost() -> Int {
        return super.getBoost() / damageLevel
    }
    
    //もしsuper classのpropertyやmethod,subscriptにfinalが指定されていたら
    //overrideできずコンパイルエラーになる。
    override var description: String {
        return "\(super.description) but \(getName()) has level \(damageLevel) damage!"
    }
}

func displayInheritanceInstances() {
    let ac1 = FastAircraft(name: "NewAir", boost: 10, power: 5)
    let ac2 = DamagedAircraft(name: "OldAir", boost: 8, damageLevel: 2)
    
    let sampleSpeed = 10.0
    
    //letで宣言されたインスタンスのプロパティに変更を加えているが
    //classのインスタンスなのでエラーにならない。
    ac1.speed = sampleSpeed
    ac2.speed = sampleSpeed
    
    print("FastAircraft description = \(ac1.description)")
    print("DamagedAircraft description = \(ac2.description)")
}





