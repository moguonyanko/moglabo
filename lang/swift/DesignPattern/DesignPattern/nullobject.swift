//
//  nullobject.swift
//  DesignPattern
//
//

import Foundation

private protocol User {
    var name: String { get }
    var age: Int { get }
}

private extension User {
    var description: String {
        return "My name is \(name), I am \(age) years old."
    }
}

private struct NormalUser: User {
    let name: String
    let age: Int
}

private struct NullUser: User {
    let name = "no name"
    let age = -1
}

private class UserProvider {
    private static let users = [
        "A": NormalUser(name: "foo", age: 20),
        "B": NormalUser(name: "bar", age: 16),
        "C": NormalUser(name: "baz", age: 35)
    ]
    private static let nullUser = NullUser()
    static func getUser(_ id: String) -> User {
        if let user = users[id] {
            return user
        } else {
            return nullUser
        }
    }
}

struct NullObject {
    static func main() {
        let u1 = UserProvider.getUser("A")
        let u2 = UserProvider.getUser("B")
        let u3 = UserProvider.getUser("Z")
        [u1, u2, u3].forEach { print($0.description) }
    }
}
