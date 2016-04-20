func testGreet(){
    if Process.arguments.count < 2 {
        print("Require argument as name")
    } else {
        let name = Process.arguments[1]
        greet(name: name, count: 10)
    }
}

func testFractorial(){
    if Process.arguments.count < 2 {
        print("Require fractorial argument")
    } else {
        let arg = Process.arguments[1]
        let n: Int! = Int(arg)
        if n != nil {
            let result = fractorial(n: n)
            print("Fractorial(\(n)) = \(result)")
        } else {
            print("Illegal argument \"\(arg)\" as Int")
        }
    }
}

testFractorial()