//
//  main.swift
//  PracticeSwift
//
//  Swift practices for my studying
//
//  Created by moguonyanko on 2017/01/26.
//

import Foundation

func runPracticesBasicOperators() {
    assignTwoVariables()
    compareTuples()
    coalesceNil()
    iterateRanges()
}

func runPracticesStringsAndCharacters() {
    charactersToString()
    catStringByIndex()
    mutateStringValue()
    dumpUnicodeCodes()
}

func runPracticesCollectionTypes() {
    createArrayWithDefaultValue()
    combineArrays()
    modifyArrayElements()
    iterateArrayElements()
    createSetWithDefaultArray()
    removeElementOfSet()
    operateSets()
    checkMemberOfSets()
    createDictionaryWithDefaultValues()
    modifyDictionay()
    iterateMapPairs()
}

func runPracticesControlFlow() {
    ignoreIndex()
    repeatAddNumbers()
    checkSwitchCasesWithoutFallthrough()
    matchCaseByRange()
    matchCaseByTuple(x: 0, y: 5)
    bindValueInSwitch(x: 5, y: 3)
    bindValueByWhere(x: 4, y: -4)
    bindValueInCompoundCases(x: 10, y: 0)
    fallthroughCases()
    exitByGuard(keywords: ["order": "Run"])
}

func runPracticesFunctions() {
    displayReturnValue(adding: false)
    ignoreReturnValue()
    printMultipleReturnValues()
    printOptionalValues()
    specifyngArgumentFunction(greeting: "Hello", name: "Taro")
    omitArgumentLabel("Hello", "Jiro")
    addFunctionWithDefaultParameters(param2: 100)
    printCenterNumber()
    swapGreeting()
    runFunctionType()
    runFunctionTypeInRange()
}

//Entry point

func runPractices() {
    //runPracticesBasicOperators()
    //runPracticesStringsAndCharacters()
    //runPracticesCollectionTypes()
    //runPracticesControlFlow()
    runPracticesFunctions()
}

runPractices()
