func main(){
    if Process.arguments.count < 2 {
        print("Require argument as name")
    } else {
        let name = Process.arguments[1]
        greet(name: name, count: 10)
    }
}

main()