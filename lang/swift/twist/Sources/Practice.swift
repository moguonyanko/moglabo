func practiceOptional(){
    var s1: String = "String"
    var s2: String? = "String?"
    var s3: String! = "String!"
    
    print(s1, s2, s3)
}

private let practices = [
    practiceOptional
]

func runPractices(){
    for f in practices {
        f()
    }
}