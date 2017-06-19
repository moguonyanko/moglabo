//
//  singleton.swift
//  DesignPattern
//
//

import Foundation

private protocol Resource {
    //var pool: ResourcePool { get }
    func use()
    func release()
    init(pool: ResourcePool)
}

//protocolにstored propertyを定義すると具象クラスの実装が困難になるかもしれない。
//デフォルト設定など共通の性質はextensionに定義する方が良い。
//protocolに宣言すると実装時にprivateやletで宣言できなくなるのも好ましくない。
//weakを指定することもできなくなる。
private protocol ResourcePool {
    //var maxPoolSize: Int { get }
    //static var pool: ResourcePool! { get }
    //var resourses: [Resource] { get }
    //protocolのinitにconvenienceは指定できない。
    //initをprotocolに宣言すると後でconvenienceにできなくなる。
    //すなわち他のinitから呼び出すような変更を行うことができなくなる。
    //init(maxPoolSize: Int)
    //throwsもprotocolの要求の一部である。
    //throwsが宣言されないとprotocolのメソッドを定義したと認められない。
    func acquire() throws -> Resource
    func release(resource: Resource)
    //static func getInstance<T: ResourcePool>() -> T!
}

private enum ResourceError: Error {
    case missingResource, missingConfig, overflowResource
}

private class Connection: Resource {
    //TODO: weakではないのでメモリリークするはず。
    //しかしweakを指定するとコンパイルエラーになってしまう。
    private let pool: ResourcePool
    //structで定義された場合継承されることが無いのでrequiredが不要になる。
    required init(pool: ResourcePool) {
        self.pool = pool
    }
    func use() {
        print("connect!")
    }
    func release() {
        pool.release(resource: self)
    }
    //deinitはclassでないと定義できない。
    deinit {
        release()
        print("This connection has disposed.")
    }
}

private let defaultMaxPoolSize = 10

private let resourceConfig = [
    "maxPoolSize": 3
]

private func getResourceConfig(name: String) throws -> Int {
    guard let config = resourceConfig[name] else {
        throw ResourceError.missingConfig
    }
    return config
}

private func getMaxPoolSize() -> Int {
    if let poolSize = try? getResourceConfig(name: "maxPoolSize") {
        return poolSize
    } else {
        return defaultMaxPoolSize
    }
}

private final class ConnectionPool: ResourcePool {
    private var maxPoolSize = getMaxPoolSize()
    private var resourses: [Resource] = [Resource]()
    //generic typeにstaticを指定することはできない。
    private static var pool = ConnectionPool()
    private init() {}
    //convenienceはclassのinitでないと指定できない。
    //requiredが指定されていないとstaticメソッドからinitを呼び出せない。
    //required init(maxPoolSize: Int) {
    //    self.maxPoolSize = maxPoolSize
    //}
    func addAll(resources: [Resource]) {
        resources.forEach { release(resource: $0) }
    }
    func release(resource: Resource) {
        if resourses.count + 1 <= maxPoolSize {
            resourses.append(resource)
        }
    }
    func acquire() throws -> Resource {
        guard let resource = resourses.popLast() else {
            throw ResourceError.missingResource
        }
        return resource
    }
    static func getInstance() -> ConnectionPool {
        return pool
    }
}

//private extension ConnectionPool {
//    static var defaultMaxPoolSize: Int {
//        return 10
//    }
//}

struct Singleton {
    static func main() {
        let pool = ConnectionPool.getInstance()
        let cons = [
            Connection(pool: pool),
            Connection(pool: pool),
            Connection(pool: pool)
        ]
        pool.addAll(resources: cons)
        if let con = try? pool.acquire() {
            con.use()
        }
    }
}
