/**
 * Hello, Swift world!
 */
func helloSwift(count: Int){
    var name = "no name"
    if Process.arguments.count >= 2 {
        name = Process.arguments[1]
    }
    greet(name: name, count: count)
}

func main() throws {
    helloSwift(count: 3)
    let testCount = try runAllTests()
    print("\(testCount) tests finished")    
}

try main()