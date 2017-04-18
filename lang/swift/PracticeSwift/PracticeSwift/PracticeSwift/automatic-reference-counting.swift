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
    var student: Student? = Student(name: "hoge")
    var schoolClass: SchoolClass? = SchoolClass(className: "3-B")
    
    student!.belong = schoolClass
    schoolClass!.students.append(student!)
    
    //強い参照で循環しているためnilを代入してもdeinitが実行されない。
    student = nil
    schoolClass = nil
    
    print("*** Strong reference cycle: Finished setting nil. ***")
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
    
    print("*** Weak reference cycle: Finished setting nil. ***")
    
    //schoolClassにnilを代入しない場合，この関数の実行完了後に
    //WeakSchoolClass，SchoolClass，StudentListのdeinitが実行される。
}

//Unowned References




















