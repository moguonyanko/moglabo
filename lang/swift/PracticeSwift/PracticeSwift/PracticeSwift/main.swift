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
}

//Entry point

func runPractices() {
    //runPracticesBasicOperators()
    //runPracticesStringsAndCharacters()
    runPracticesCollectionTypes()
}

runPractices()
