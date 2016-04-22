func main() throws {
    var mode = "unknown"
    
    if Process.arguments.count >= 2 {
        mode = Process.arguments[1]
    }
    
    switch mode.lowercased() {
        case "test":
            print("\(try runAllTests()) tests finished")    
        case "practice":
            runPractices()
        case "hello":
            helloSwift(count: 3, name: "twister")
        default:
            print("Unsupported mode: " + mode)
    }
}

try main()