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
    displayMultilineStringLiterals()
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
    convertErrorToOptionalalue()
    notPropagateError()
    handleErrorByDoCatch()
    handleErrorByOptionalValue()
    handleErrorWithoutPropagation()
    finishWorkByDefer()
}

private func runPracticesTypeCasting() {
    checkingTypeWithDuducing()
    donwcastObjects()
    displayAnyListElementsByMatching()
    displayAnyObjectList()
}

private func runPracticesNestedTypes() {
    displayNestedTypeValues()
}

private func runPracticesExtensions() {
    calcByCustomExtension()
    adaptExtensionsWithInitializers()
    printCustomMapResults()
    displayMutatingMethod()
    updateStringsByExtensionSubscript()
    classifyNumbersByExtension()
    doSampleWithExtensionOfFinalElements()
}

private func runPracticesProtocols() {
    checkProtocolAccessor()
    checkProtocolMethods()
    checkProtocolMutating()
    checkProtocolInitializer()
    checkProtocolFailableInitializer()
    executeCalclationsByProtocolType()
    displayDelegationObjects()
    dumpResultsByExtensionProtocol()
    checkProtocolAdoptionObject()
    displayCollectionPropertiesByProtocolTypes()
    checkInheritedProtocol()
    checkClassOnlyProtocol()
    checkMultiProtocolObjects()
    checkProtocolTypes()
    displayResultByOptionalProtocols()
    displayExtentedProtocolResults()
    displayResultByConstrainedProtocol()
}

private func runPracticesGenerics() {
    operateByGenericFunction()
    operateGenericCollection()
    operateWithExtendedGenericsType()
    runConstrainedGenericsFunction()
    displayTypeAliasResult()
    checkGenericTypedCollection()
    checkAssosiationExistingType()
    adoptWhereClauseToGenericCollection()
    callFunctionWithGenericExtension()
    displayGenericSubscriptResult()
    runCaseGenericsWhereClause()
}

private func runPracticesAccessControl() {
    displayInternalAccessControlResult()
    displayAccessLevelSamples()
    checkTupleAccessLevel()
    callGetterAccessLeveledTuple()
    checkEnumAccessLevel()
    accessPrivateNestedClass()
    checkSubclassingAccessLevelResults()
    checkPrivateAccesserProperties()
    checkInitializerAccessLevel()
    checkExtensionAccessLevelDiff()
}

private func runPracticesAdvancedOperators() {
    calcFormulaWithOperatorMethod()
    convertValueByUnaryOperator()
    calcBycompoundAssignmentOperator()
    checkEquivalenceWithOverloadedOperators()
    convertValueByCustomOperator()
    calcByCustomInfixOperator()
}

private func runPracticesLanguageReference() {
    applyTypeAliases()
    matchTupleTypes()
    matchFunctionType()
    checkComposedProtocolTypes()
    displayResultWithInheritance()
    calcVariousClosure()
    runCapturedClosure()
    checkTypeVariableProperties()
    declareTypeAliasWithTypeChecking()
    checkThrowableClassBehavior()
    collectValuesByEnum()
    checkCustomPrecedenceGroup()
    pickupOnlyNonNilValues()
}

private func runAllCasesOfReconsiderationGenerics() {
    ReconsiderationGenerics.main()
}

private func runPracticesTheBasics() {
    TheBasics.main()
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
    //runPracticesErrorhandling()
    //runPracticesTypeCasting()
    //runPracticesNestedTypes()
    //runPracticesExtensions()
    //runPracticesProtocols()
    //runPracticesGenerics()
    //runPracticesAccessControl()
    //runPracticesAdvancedOperators()
    //runPracticesLanguageReference()
    //runPracticesTheBasics()
    
    // Extended Reconsideration Sample
    runAllCasesOfReconsiderationGenerics()
}

runPractices()
