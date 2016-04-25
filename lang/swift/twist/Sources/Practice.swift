//Optionals practice

private func displayOptionalString(){
    let s1: String = "String"
    let s2: String? = "String?"
    let s3: String! = "String!"
    
    print(s1, s2, s3)
    
    var s4: String?
    /**
     * nilが設定されている変数に対して!をつけて参照しようとすると実行時エラーになる。
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

func practiceOptional(){
    displayOptionalString()
    displayOptionalInt()
    displayOptionalBinding()
}

//Practices runner

private let practices = [
    practiceOptional
]

func runPractices(){
    for f in practices {
        f()
    }
}