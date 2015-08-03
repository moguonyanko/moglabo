// Playground - noun: a place where people can play

//import UIKit

func greet(){
    var str = "Hello, playground"
    println(str)
}

class Rational {
    var numer: Int = 0
    var denom: Int = 0
    
    init(numer: Int, denom: Int) {
        self.numer = numer
        self.denom = denom
    }
    
    func equals (other: Rational) -> Bool {
        return (self.numer * other.denom) == (other.numer * self.denom)
    }
}

func addRational (x: Rational, y: Rational) -> Rational {
    let _numer = x.numer * y.denom + y.numer * x.denom
    let _denom = x.denom * y.denom
    
    return Rational(numer: _numer, denom: _denom)
}

func subRational(x: Rational, y: Rational) -> Rational {
    let _numer = x.numer * y.denom - y.numer * x.denom
    let _denom = x.denom * y.denom
    
    return Rational(numer: _numer, denom: _denom)
}

func mulRational(x: Rational, y: Rational) -> Rational {
    let _numer = x.numer * y.numer
    let _denom = x.denom * y.denom
    
    return Rational(numer: _numer, denom: _denom)
}

func divRational(x: Rational, y: Rational) -> Rational {
    let _numer = x.numer * y.denom
    let _denom = x.denom * y.numer
    
    return Rational(numer: _numer, denom: _denom)
}

func linearCombination(a: Int, b: Int, x: Int, y: Int) -> Int {
    return a * x + b * y
}

func insertSort(data:Array<Int>){
    /* @todo implement */
}

// Entry point

func main(){
    let r1 = Rational(numer: 1, denom: 2)
    let r2 = Rational(numer: 1, denom: 2)
    
    addRational(r1, r2)
}

main()
