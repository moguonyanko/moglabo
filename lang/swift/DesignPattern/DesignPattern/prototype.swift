//
//  prototype.swift
//  DesignPattern
//
//

import Foundation

private class Result<T> {
    private let content: T
    init(content: T) {
        self.content = content
    }
    var description: String {
        return "\(content)"
    }
}

private protocol Readable: NSCopying {
//    associatedtype Result
    func read() -> Any
}

private class RecordBase {
    private var id: String
    private var type: String
    init(id: String, type: String) {
        self.id = id
        self.type = type
    }
    convenience init(record: RecordBase) {
        self.init(id: record.id, type: record.type)
    }
    var recordId: String {
        return id
    }
}

private class StringRecord: RecordBase, Readable {
    init(id: String) {
        super.init(id: id, type: "string")
    }
    func read() -> Any {
        return "Hello, world"
    }
    func copy(with zone: NSZone? = nil) -> Any {
        let copied = StringRecord(id: self.recordId)
        return copied
    }
}

private class IntRecord: RecordBase, Readable {
    init(id: String) {
        super.init(id: id, type: "int")
    }
    func read() -> Any {
        return 1
    }
    func copy(with zone: NSZone? = nil) -> Any {
        let copied = IntRecord(id: self.recordId)
        return copied
    }
}

private class BoolRecord: RecordBase, Readable {
    init(id: String) {
        super.init(id: id, type: "bool")
    }
    func read() -> Any {
        return true
    }
    func copy(with zone: NSZone? = nil) -> Any {
        let copied = BoolRecord(id: self.recordId)
        return copied
    }
}

private class RecordDB {
    // stored propertyの定義にgeneric typeを含むことはできない。
    private static var cache = [String: Readable]()
    static func getRecord(id: String) -> Readable? {
        let rec = cache[id]
        return rec?.copy() as? Readable
    }
    static func load() {
        let sr = StringRecord(id: "A")
        cache[sr.recordId] = sr
        let ir = IntRecord(id: "B")
        cache[ir.recordId] = ir
        let br = BoolRecord(id: "C")
        cache[br.recordId] = br
    }
}

struct Prototype {
    static func main() {
        RecordDB.load()
        let ids = ["A", "X", "B", "Y", "C"]
        let recs = ids.map { RecordDB.getRecord(id: $0) }
        recs.forEach {
            if let rec = $0 {
                print(rec.read())
            }
        }
    }
}
