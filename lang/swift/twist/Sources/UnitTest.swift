/**
 * Common test functions and errors
 */
enum AssertError: ErrorProtocol {
    case Fail
}

func assertEquals<T: Equatable>(expected: T, actual: T) throws {
    guard expected == actual else {
        throw AssertError.Fail
    } 
}

/**
 * All target tests
 */
private let allTests = [
    "Math": [testFactorial]
]

/**
 * All tests runner
 */
func runAllTests() throws -> Int {
    var testCount = 0
    
    for (moduleName, testCases) in allTests {
        for testCase in testCases {
            try testCase()
            testCount += 1
        }
        print("\(moduleName) test is OK")
    }
    
    return testCount
}