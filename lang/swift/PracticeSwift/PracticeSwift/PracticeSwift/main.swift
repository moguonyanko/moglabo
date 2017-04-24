//
//  main.swift
//  PracticeSwift
//
//  Swift practices for my studying
//

import Foundation

private func runPracticesBasicOperators() {
    assignTwoVariables()
    compareTuples()
    coalesceNil()
    iterateRanges()
}

private func runPracticesStringsAndCharacters() {
    charactersToString()
    catStringByIndex()
    mutateStringValue()
    dumpUnicodeCodes()
}

private func runPracticesCollectionTypes() {
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

private func runPracticesControlFlow() {
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

private func runPracticesFunctions() {
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
    chooseTargetFunction()
}

private func runPracticesClosures() {
    sortedByClosure()
    anotherViewSortedNames(names: ["foo", "bar", "baz", "hoge", "fuga"])
    translateNumbers()
    calcWithCapturingValue()
    runEscapingFunction()
    updateValueByAutoClosures()
    updateValueByEscapingAutoClosures()
}

private func runPracticesEnumerations() {
    matchEnumMembers()
    displayAssociatedValues()
    checkEnumRawValues()
    displayEnumByRawValue()
    calcByEnumExpression()
}

private func runPracticesClassesAndStructures() {
    dumpSampleClassProperties()
    changeStructureProperties()
    changeEnumerationValue()
    changeClassProperties()
    identicalToInstances()
}

private func runPracticesProperties() {
    displayLazyProperties()
    accessStructProperties()
    checkActionOfObservers()
    changeTypeProperties()
}

private func runPracticesMethods() {
    modifyValueTypeInstance()
    mutateEnumCases()
    checkActionOfTypeMethods()
}

private func runPracticesSubscripts() {
    displaySubscriptValue()
    accessMultiIndexBySubscript()
}

private func runPracticesInheritance() {
    displayInheritanceInstances()
}

private func runPracticesInitialization() {
    displayInstancesByOverloadInit()
    checkInitlabels()
    printDefaultInitInstance()
    displayInstancesByValueTypeInitializers()
    displayInheritanceInits()
    dumpInstancesByCreatingAutomaticInitializers()
    displayActionInitializers()
    displayInstanceByFailableInitializer()
    displayFailableEnumeration()
    checkPropagationFailableInitializers()
    checkOverridringFailableInitializers()
    displayOverridedFailableInitialiers()
    createInstanceWithDefaultPropertyWithFunction()
}

private func runPracticesDeinitialization() {
    displayDeinitializationInstanceAction()
}

private func runPracticesAutomaticReferenceCounting() {
    createStrongReferenceCycle()
    createWeakReferenceCycle()
    createUnownedReferenceCycle()
    printImplicitlyProperty()
    resolveReferenceCycleByClosure()
}

private func runPracticesOptionalChaining() {
    checkOptionalChainingByAccessingProperties()
    failSetProperty()
    printVoidResult()
    checkOptionalChainingByAccessingSubscripts()
    printOptionalTypeOfDictionary()
    printOptionalTypeByMultipleChaining()
    printResultWithMultipleOptionReturnValues()
}

private func runPracticesErrorhandling() {
    checkMyError()
}

//Entry point

private func runPractices() {
    //runPracticesBasicOperators()
    //runPracticesStringsAndCharacters()
    //runPracticesCollectionTypes()
    //runPracticesControlFlow()
    //runPracticesFunctions()
    //runPracticesClosures()
    //runPracticesEnumerations()
    //runPracticesClassesAndStructures()
    //runPracticesProperties()
    //runPracticesMethods()
    //runPracticesSubscripts()
    //runPracticesInheritance()
    //runPracticesInitialization()
    //runPracticesDeinitialization()
    //runPracticesAutomaticReferenceCounting()
    //runPracticesOptionalChaining()
    runPracticesErrorhandling()
}

runPractices()
