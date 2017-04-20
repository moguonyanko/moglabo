//
//  automaticreferencecounting.swift
//  PracticeSwift
//
//  Automatic Reference Counting Practices
//

import Foundation

//Strong Reference Cycles Between Class Instances
private class Student {
    private let name: String
    var belong: SchoolClass?
    init(name: String) {
        self.name = name
    }
    deinit {
        print("Student '\(name)' is deinitialized.")
    }
}

private class StudentList {
    var students: [Student] = []
    func append(_ student: Student) {
        students.append(student)
    }
    deinit {
        print("Student list is deinitialized.")
    }
}

private class SchoolClass {
    let className: String
    var students = StudentList()
    init(className: String) {
        self.className = className
    }
    deinit {
        print("SchoolClass '\(className)' is deinitialized.")
    }
}

func createStrongReferenceCycle() {
    print("*** Strong reference cycle ***")
    
    var student: Student? = Student(name: "hoge")
    var schoolClass: SchoolClass? = SchoolClass(className: "3-B")
    
    student!.belong = schoolClass
    schoolClass!.students.append(student!)
    
    //強い参照で循環しているためnilを代入してもdeinitが実行されない。
    student = nil
    schoolClass = nil
}

//Resolving Strong Reference Cycles Between Class Instances

//Weak References
private class WeakSchoolClass: SchoolClass {
    //配列にweakを指定することはできない。
    //weak var students: [Student] = []
    //strong referenceなプロパティをweak referenceなプロパティでオーバーライドすることはできない。
    weak var weakStudents = StudentList()
    
    //classNameを受け取るinitは自動的に継承されている。
    
    //deinitは自動的に継承されない。サブクラスで固有の処理を行いたければ別途deinitを定義する。
    //overrideを指定することはできない。
    deinit {
        print("Weak school class '\(super.className)' is deinitialized.")
    }
}

func createWeakReferenceCycle() {
    print("*** Weak reference cycle ***")
    
    var student: Student? = Student(name: "fuga")
    var schoolClass: WeakSchoolClass? = WeakSchoolClass(className: "2-A")
    
    student!.belong = schoolClass
    //ここでweak referenceを持つのはWeakSchoolClassのオブジェクトだけ。
    //weakStudents!とすると実行時エラーになる。
    schoolClass!.weakStudents?.append(student!)
    
    //循環参照の一方がweak referenceであれば，もう一方がstrong referenceであっても
    //循環参照によってメモリが解放されない状態を解消することができる。
    
    //StudentListとStudentのdeinitが実行される。
    student = nil
    //WeakSchoolClassとSchoolClassそしてStudentListのdeinitが実行される。
    schoolClass = nil
    
    //schoolClassにnilを代入しない場合，この関数の実行完了後に
    //WeakSchoolClass，SchoolClass，StudentListのdeinitが実行される。
}

//Unowned References
private class Employee {
    private let name: String
    private var idCard: EmployeeIdCard?
    init(name: String) {
        self.name = name
    }
    func receiveIdCard(idCard: EmployeeIdCard) {
        self.idCard = idCard
    }
    deinit {
        print("Employee '\(name)' is being deinitialized.")
    }
}

private class EmployeeIdCard {
    private let number: UInt64
    private unowned let employee: Employee
    init(number: UInt64, employee: Employee) {
        self.number = number
        self.employee = employee
    }
    deinit {
        print("Employee ID card '\(number)' is being deinitialized.")
    }
}

func createUnownedReferenceCycle() {
    print("*** Unowned reference cycle ***")
    
    var employee: Employee? = Employee(name: "foo")
    let idCard = EmployeeIdCard(number: 1111_2222_3333_4444, employee: employee!)
    
    employee!.receiveIdCard(idCard: idCard)
    
    employee = nil
    
    //idCardにnilを代入しなくてもEmployeeIdCardのdeinitが呼び出される。
}

//Unowned References and Implicitly Unwrapped Optional Properties
private class Area {
    let name: String
    init(name: String) {
        self.name = name
    }
    deinit {
        print("Area '\(name)' is being deinitialized.")
    }
}

private class Prefecture: Area {
    //最後の!はnilをデフォルト値として持つことを示す。
    //?を付けた場合と異なり参照する側で!を付ける必要が無い。
    private var prefectureCode: AddressCode!
    init(name: String, code: UInt64) {
        super.init(name: name)
        self.prefectureCode = AddressCode(code: code, area: self)
    }
    var code: AddressCode {
        return prefectureCode
    }
    deinit {
        print("Prefecture('\(prefectureCode.description)') is being deinitialized.")
    }
}

private class AddressCode {
    let code: UInt64
    unowned let area: Area
    init(code: UInt64, area: Area) {
        self.code = code
        self.area = area
    }
    var description: String {
        return "address code = '\(code)'"
    }
    deinit {
        print("Address code '\(code)' is being deinitialized.")
    }
}

func printImplicitlyProperty() {
    let pref = Prefecture(name: "Tokyo", code: 13)
    print("\(pref.name) has \(pref.code.description)")
    
    //関数の処理が完了するとPrefecture，Area，AddressCodeの順でdeinitが呼び出される。
    //AddressCodeのareaプロパティにunownedが指定されていなかったらどのdeinitも呼び出されない。
}

//Resolving Strong Reference Cycles for Closures
private class Addition {
    let x: Int
    //!でOptionalを得た場合は参照する側で?や!を付ける必要が無くなるが
    //オブジェクトがnilだった場合エラーになる。
    //?でOptionalを得た場合は変数の末尾に?や!を付けて参照することを強制される。
    //?を付けてnilを参照した場合，String型の値を得る操作を行ったのならばnilという文字列が得られる。
    //!を付けてnilを参照した場合はエラーになる。つまり!でOptionalを得た場合と同じ動作になる。
    let y: Int!
    
    init(_ x: Int, _ y: Int!) {
        self.x = x
        self.y = y
    }
    
    lazy var calc: () -> Int = {
        //selfをunowned referenceにすることでAdditionのオブジェクトの参照が
        //nilになった時にdeinitが呼び出される。
        //closure内のselfは常にunowned referenceにする訳にはいかなかったのだろうか。
        [unowned self] in
        if let y = self.y {
            return self.x + y
        } else {
            return self.x
        }
    }
    
    deinit {
        //Int型の値から文字列を得るにはdescriptionを使う。そうしなければ
        //Optionalだった場合にOptional(10)のような結果になってしまう。
        print("'\(x.description) plus \(y.description)' is being deinitialized.")
    }
}

func resolveReferenceCycleByClosure() {
    let x = 10, y = 20
    var addition: Addition? = Addition(x, y)
    let result = addition?.calc().description
    
    //calc()の戻り値はInt型なのでdescriptionを経由しない場合
    //??の後のデフォルト値にString型を指定することができない。
    print("Calculation result = \(result ?? "No Data")")
    
    addition = nil
    
    //calc内のselfがunowned referenceでなかった場合はAdditionのオブジェクトが
    //deinitializeされない。
}
