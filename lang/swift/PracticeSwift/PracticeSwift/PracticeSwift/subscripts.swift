//
//  subscripts.swift
//  PracticeSwift
//
//  Subscripts practices
//

import Foundation

//Subscript Syntax
private struct PowTable {
    let base: Decimal
    subscript(exp: Int) -> Decimal {
        return pow(base, exp)
    }
}

func displaySubscriptValue() {
    let table = PowTable(base: 2)
    print("exponent = 2: \(table[2])")
    print("exponent = 3: \(table[3])")
    print("exponent = 4: \(table[4])")
}

//Subscript Options
private struct Matrix {
    private let rows: Int, columns: Int
    private var grid: [Int] = []
    private static let outOfMsg = "範囲外"
    
    //structureにもinitを定義できる。
    init(rows: Int, columns: Int) {
        self.rows = rows
        self.columns = columns
        grid = Array(repeating: 0, count: rows * columns)
    }
    
    private func isIndexValid(row: Int, column: Int) -> Bool {
        return 0 <= row && row < rows &&
            0 <= column && column < columns
    }
    
    //subscriptでwillSetやdidSetは定義できない。
    subscript(row: Int, column: Int) -> Int {
        get {
            //assertの第1引数がfalseだと実行時例外が発生する。
            assert(isIndexValid(row: row, column: column), Matrix.outOfMsg)
            return grid[(row * column) + column]
        }
        set {
            assert(isIndexValid(row: row, column: column), Matrix.outOfMsg)
            grid[(row * column) + column] = newValue
        }
    }
}

func accessMultiIndexBySubscript() {
    var matrix = Matrix(rows: 10, columns: 10)
    matrix[0, 5] = 10
    matrix[2, 2] = 20
    
    print("matrix[0, 5] = \(matrix[0, 5])")
    print("matrix[2, 2] = \(matrix[2, 2])")
    
    //matrix[11, 11] = 99
}









