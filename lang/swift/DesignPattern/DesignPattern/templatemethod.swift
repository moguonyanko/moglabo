//
//  templatemethod.swift
//  DesignPattern
//
//

import Foundation

private class Template {
    func execute() {
        head()
        body()
        tail()
    }
    private func head() {
        print("**************")
    }
    //Javaでいうところのabstract classが無いので
    //この書き方ではtemplate methodの実装を強制できない。
    //requiredはinitにしか指定できない。
    func body() {
        //need overrided
    }
    private func tail() {
        print("--------------")
    }
}

private class ConcreteA: Template {
    override func body() {
        print("ボディ部")
    }
}

private class ConcreteB: Template {
    override func body() {
        print("This is body.")
    }
}

//template methodの実装を強制するためにprotocolを使う。
//template method以外のメソッドはextensionで定義する。
private protocol TemplateProtocol {
    func body()
}

private extension TemplateProtocol {
    func head() {
        print("This is head")
    }
    func tail() {
        print("This is tail")
    }
    func execute() {
        head()
        body()
        tail()
    }
}

private class ConcreteC: TemplateProtocol {
    func body() {
        print("これはボディ部です。")
    }
}

private class ConcreteD: TemplateProtocol {
    func body() {
        print("That is all body")
    }
}

private func runAllCases() {
    var template: Template = ConcreteA()
    template.execute()
    template = ConcreteB()
    template.execute()
    var protocoledTemplate: TemplateProtocol = ConcreteC()
    protocoledTemplate.execute()
    protocoledTemplate = ConcreteD()
    protocoledTemplate.execute()
}

struct TemplateMethod {
    static func main() {
        runAllCases()
    }
}
