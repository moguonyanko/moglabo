/**
 * Hello, Swift world!
 */
func helloSwift(){
    if Process.arguments.count < 2 {
        print("Require argument as name")
    } else {
        let name = Process.arguments[1]
        greet(name: name, count: 3)
    }
}

//Common test functions and errors
 
enum AssertError: ErrorProtocol {
    case Fail
}

func assertEquals<T: Equatable>(expected: T, actual: T) throws {
    guard expected == actual else {
        throw AssertError.Fail
    } 
}

//Testcase definition

func testFractorial() throws {
    let expected = 3628800
    let actual = fractorial(n: 10)
    
    try assertEquals(expected: expected, actual: actual)
}

let allTests = [
    "Math": [testFractorial]
]

/**
 * All tests runner
 */
func runAllTests() throws {
    for (moduleName, testCases) in allTests {
        for testCase in testCases {
            try testCase()
        }
        print("\(moduleName) test is OK")
    }
}

//Test entry point
try runAllTests()
print("\(allTests.count) tests finished")