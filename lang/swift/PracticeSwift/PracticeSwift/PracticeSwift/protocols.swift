//
//  protocols.swift
//  PracticeSwift
//
//  Protocols practices
//

import Foundation

//Protocol syntax
private protocol SomeProtocol {
    //pass
}

private protocol AnyProtocol {
    //pass
}

//structureもprotocolを継承できる。
private struct SomeStructure: SomeProtocol, AnyProtocol {
    //pass
}

private class BaseClass {
    //pass
}

//protocolをクラス定義に複数指定することは可能。
private class SubClass: BaseClass, SomeProtocol, AnyProtocol {
    //pass
}

