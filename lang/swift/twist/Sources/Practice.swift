//Optional practice

private func displayOptionalString(){
    let s1: String = "String"
    let s2: String? = "String?"
    let s3: String! = "String!"
    
    print(s1, s2, s3)
    
    var s4: String?
    /**
     * nilが設定されている変数・定数に対して!をつけて参照しようとすると実行時エラーになる。
     */
    print("Default String? value = \(s4)")
    s4 = "not constant"
}

private func displayOptionalInt(){
    let intSrc = "12345"
    let i1 = Int(intSrc)
    print("\(intSrc) by Int? = \(i1)")
    print("\(intSrc) by Int? with ! = \(i1!)")
    
    let i2: Int = i1!
    print("\(intSrc) by Int = \(i2)")
    
    print("Int? == Int = \(i1 == i2)")
    print("Int? with ! == Int = \(i1! == i2)")
}

private func displayOptionalBinding(){
    let s = "Hello"
    
    if let i = Int(s) {
        print("Input Int = \(i)")
    } else {
        /**
         * if文で宣言した変数が有効なのはif文の中だけであり，else文の中で参照すると
         * コンパイルエラーになる。
         */
        //print("Input Int = \(i)")
        print("Can't convert to Int = \"\(s)\"")
    }
    
    let a = "10", b = "Hey"
    
    if let aa = Int(a), bb = Int(b) where aa < bb {
        print("\(bb) is larger than \(aa)")    
    } else {
        /**
         * 比較演算子でnilと比較するとエラーにはならずfalseと評価される。
         */
        print("Fail optional binding \(a) and \(b)")
    }
}

private func displayImplicityUnwrappedOptional() {
    let implicityOpt: String! = "implicity unwrapped optional"
    let normalOpt: String? = "noraml optional"
    
    /**
     * Implicity unwrappedであってもOptionalなのでnilとの比較が可能。
     */
    if implicityOpt != nil && normalOpt != nil {
        /**
         * Implicity unwrappedなので!を変数・定数の最後に付けていなくても内部の値を得られる。
         */
        print("Implicity unwrapped optional value = \"\(implicityOpt)\"")
        /**
         * NormalのOptionalは!を付けて参照しないと内部の値ではなくOptionalオブジェクトが
         * 返されてしまう。
         */
        print("Normal optional value = \"\(normalOpt!)\" in \(normalOpt)")
    } 
} 

func practiceOptional(){
    displayOptionalString()
    displayOptionalInt()
    displayOptionalBinding()
    displayImplicityUnwrappedOptional()
}

// Function practice

func myDivide(divisor: Int, dividend: Int) -> (quotient: Int, remainder: Int) {
    let quotient = divisor / dividend
    let remainder = divisor % dividend
    
    return (quotient, remainder)
}

func displayMultipleReturnValues() {
    let divisor = 100, dividend = 33
    let result = myDivide(divisor: divisor, dividend: dividend)
    
    print("\(divisor) / \(dividend) = \(result.quotient)")
    print("\(divisor) % \(dividend) = \(result.remainder)")
    print("(quotient, remainder) = \(result)")
}

private func mySum(start: Int = 1, end: Int = 10) -> Int {
    var n = 0
    for i in start...end {
        n += i
    }   
    return n
}

func displayDefaultParameterFuncResult() {
    print("Default parameter result = \(mySum())")
}

func practiceFunction() {
    displayMultipleReturnValues()
    displayDefaultParameterFuncResult()
}

//Practices runner

private let practices = [
    practiceOptional,
    practiceFunction
]

func runPractices(){
    for f in practices {
        f()
    }
}