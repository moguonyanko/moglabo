func greet(name: String, count: Int){
    for _ in 1...count {
        print("Hello, \(name)!!!")
    }
}

/**
 * Hello, Swift world!
 */
func helloSwift(count: Int, name: String?){
    var targetName = "no name"
    if name != nil {
        targetName = name!
    }
    greet(name: targetName, count: count)
}