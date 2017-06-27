//
//  the-basics.swift
//  PracticeSwift
//
//

import Foundation

//Assertion and Precondition
private func testAssertion() {
    let x = "Hello"
    assert(x == "Hey", "Error text")
}

private func testAssertionWithIf(name: String = "no name") {
    if !name.isEmpty {
        print("Hello \(name)")
    } else {
        assertionFailure("Name is empty!")
    }
}

//Enforcing Preconditions
private func testPrecondition(password: String) {
    precondition(!password.isEmpty, "Password is empty!")
}

private func testPreconditionFailure(address: String?) {
    guard let adr = address else {
        preconditionFailure("no address")
    }
    print("\(adr)")
}

struct TheBasics {
    static func main() {
        //assertはErrorを発生させるがtryを指定して呼び出してもエラーハンドリングできない。
        //let _ = try? testAssertion()
        testAssertionWithIf(name: "hoge")
        //assertと同様preconditionもtryを指定してもエラーハンドリングできない。
        //let _ = try? testPrecondition(password: "")
        testPreconditionFailure(address: "fuga city")
    }
}
